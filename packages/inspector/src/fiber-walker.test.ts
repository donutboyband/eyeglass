import { describe, it, expect, beforeEach } from 'vitest';
import { extractFrameworkInfo } from './fiber-walker.js';

// Helper to create a mock function with a displayName
function createMockComponent(name: string) {
  const fn = function () {};
  fn.displayName = name;
  return fn;
}

describe('extractFrameworkInfo', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('vanilla detection', () => {
    it('should return vanilla for plain DOM elements', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const info = extractFrameworkInfo(div);

      expect(info.name).toBe('vanilla');
      expect(info.componentName).toBeUndefined();
      expect(info.filePath).toBeUndefined();
    });
  });

  describe('React detection', () => {
    it('should detect React from __reactFiber$ key', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      // Mock React fiber structure
      const mockFiber = {
        tag: 0, // FunctionComponent
        type: createMockComponent('MyComponent'),
        return: null,
        _debugSource: {
          fileName: 'src/components/MyComponent.tsx',
          lineNumber: 42,
        },
        memoizedProps: {
          className: 'test',
          onClick: () => {},
          isActive: true,
        },
      };

      (div as any)['__reactFiber$abc123'] = mockFiber;

      const info = extractFrameworkInfo(div);

      expect(info.name).toBe('react');
      expect(info.componentName).toBe('MyComponent');
      expect(info.filePath).toBe('src/components/MyComponent.tsx');
      expect(info.lineNumber).toBe(42);
    });

    it('should detect React from __reactInternalInstance$ key', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const mockFiber = {
        tag: 0,
        type: createMockComponent('Button'),
        return: null,
      };

      (div as any)['__reactInternalInstance$xyz789'] = mockFiber;

      const info = extractFrameworkInfo(div);

      expect(info.name).toBe('react');
      expect(info.componentName).toBe('Button');
    });

    it('should extract safe props (primitives only)', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const mockFiber = {
        tag: 0,
        type: createMockComponent('Card'),
        return: null,
        memoizedProps: {
          title: 'Hello',
          count: 42,
          isOpen: true,
          data: null,
          children: ['some', 'children'],
          onClick: () => {},
          config: { nested: 'object' },
        },
      };

      (div as any)['__reactFiber$test'] = mockFiber;

      const info = extractFrameworkInfo(div);

      expect(info.props).toEqual({
        title: 'Hello',
        count: 42,
        isOpen: true,
        data: null,
      });
      // Should not include children, functions, or objects
      expect(info.props?.children).toBeUndefined();
      expect(info.props?.onClick).toBeUndefined();
      expect(info.props?.config).toBeUndefined();
    });

    it('should walk up fiber tree to find component', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      // Simulate a DOM fiber with component parents
      const parentFiber = {
        tag: 0,
        type: createMockComponent('ParentComponent'),
        return: null,
      };

      const domFiber = {
        tag: 5, // HostComponent (div)
        type: 'div',
        return: parentFiber,
      };

      (div as any)['__reactFiber$test'] = domFiber;

      const info = extractFrameworkInfo(div);

      expect(info.name).toBe('react');
      expect(info.componentName).toBe('ParentComponent');
    });

    it('should collect ancestry chain', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const appFiber = {
        tag: 0,
        type: createMockComponent('App'),
        return: null,
      };

      const cardFiber = {
        tag: 0,
        type: createMockComponent('Card'),
        return: appFiber,
      };

      const buttonFiber = {
        tag: 0,
        type: createMockComponent('Button'),
        return: cardFiber,
      };

      (div as any)['__reactFiber$test'] = buttonFiber;

      const info = extractFrameworkInfo(div);

      expect(info.ancestry).toEqual(['Button', 'Card', 'App']);
    });

    it('should skip Context.Provider and similar internal components', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const appFiber = {
        tag: 0,
        type: createMockComponent('App'),
        return: null,
      };

      const providerFiber = {
        tag: 0,
        type: createMockComponent('ThemeProvider'),
        return: appFiber,
      };

      const contextFiber = {
        tag: 0,
        type: createMockComponent('Context.Consumer'),
        return: providerFiber,
      };

      const buttonFiber = {
        tag: 0,
        type: createMockComponent('Button'),
        return: contextFiber,
      };

      (div as any)['__reactFiber$test'] = buttonFiber;

      const info = extractFrameworkInfo(div);

      // The nearest user component should be Button
      expect(info.componentName).toBe('Button');
    });
  });

  describe('Vue detection', () => {
    it('should detect Vue 2 from __vue__', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      (div as any).__vue__ = {
        $options: {
          name: 'MyVueComponent',
        },
      };

      const info = extractFrameworkInfo(div);

      expect(info.name).toBe('vue');
      expect(info.componentName).toBe('MyVueComponent');
    });

    it('should detect Vue 3 from __vueParentComponent', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      (div as any).__vueParentComponent = {
        type: {
          name: 'VueThreeComponent',
          __file: 'src/components/VueThreeComponent.vue',
        },
        props: {
          message: 'Hello',
          count: 5,
        },
      };

      const info = extractFrameworkInfo(div);

      expect(info.name).toBe('vue');
      expect(info.componentName).toBe('VueThreeComponent');
      expect(info.filePath).toBe('src/components/VueThreeComponent.vue');
      expect(info.props).toEqual({
        message: 'Hello',
        count: 5,
      });
    });

    it('should detect Vue 3 with __name', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      (div as any).__vueParentComponent = {
        type: {
          __name: 'SetupScriptComponent',
        },
      };

      const info = extractFrameworkInfo(div);

      expect(info.name).toBe('vue');
      expect(info.componentName).toBe('SetupScriptComponent');
    });
  });

  describe('Svelte detection', () => {
    it('should detect Svelte from __svelte key', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      (div as any).__svelte_component = {
        constructor: {
          name: 'SvelteButton',
        },
      };

      const info = extractFrameworkInfo(div);

      expect(info.name).toBe('svelte');
    });

    it('should extract Svelte component name', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      class MySvelteComponent {}
      (div as any).__svelte_component = new MySvelteComponent();

      const info = extractFrameworkInfo(div);

      expect(info.name).toBe('svelte');
      expect(info.componentName).toBe('MySvelteComponent');
    });
  });

  describe('framework priority', () => {
    it('should prefer React over Vue if both are present', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      // Add both React and Vue markers
      const mockFiber = {
        tag: 0,
        type: createMockComponent('ReactComp'),
        return: null,
      };
      (div as any)['__reactFiber$test'] = mockFiber;

      (div as any).__vue__ = {
        $options: { name: 'VueComp' },
      };

      const info = extractFrameworkInfo(div);

      expect(info.name).toBe('react');
      expect(info.componentName).toBe('ReactComp');
    });
  });
});
