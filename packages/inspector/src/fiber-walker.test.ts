import { describe, it, expect, beforeEach } from 'vitest';
import { extractFrameworkInfo, extractHooks, extractContext, getRenderAnalysis } from './fiber-walker.js';

// Helper to create a mock function with a displayName
function createMockComponent(name: string) {
  const fn = function () {};
  fn.displayName = name;
  return fn;
}

// Fiber tag constants (must match fiber-walker.ts)
const FunctionComponent = 0;
const HostComponent = 5;
const ContextProvider = 10;

describe('extractFrameworkInfo', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('vanilla detection', () => {
    it('should return vanilla for plain DOM elements', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const info = extractFrameworkInfo(div);

      expect(info.type).toBe('vanilla');
      expect(info.name).toBe('vanilla'); // Legacy compat
      expect(info.displayName).toBeUndefined();
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
        tag: FunctionComponent,
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

      expect(info.type).toBe('react');
      expect(info.name).toBe('react'); // Legacy compat
      expect(info.displayName).toBe('MyComponent');
      expect(info.componentName).toBe('MyComponent'); // Legacy compat
      expect(info.filePath).toBe('src/components/MyComponent.tsx');
      expect(info.lineNumber).toBe(42);
    });

    it('should detect React from __reactInternalInstance$ key', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const mockFiber = {
        tag: FunctionComponent,
        type: createMockComponent('Button'),
        return: null,
      };

      (div as any)['__reactInternalInstance$xyz789'] = mockFiber;

      const info = extractFrameworkInfo(div);

      expect(info.type).toBe('react');
      expect(info.displayName).toBe('Button');
    });

    it('should extract safe props (primitives only)', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const mockFiber = {
        tag: FunctionComponent,
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

      // Legacy props location
      expect(info.props).toEqual({
        title: 'Hello',
        count: 42,
        isOpen: true,
        data: null,
      });

      // New state.props location
      expect(info.state?.props).toEqual({
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
        tag: FunctionComponent,
        type: createMockComponent('ParentComponent'),
        return: null,
      };

      const domFiber = {
        tag: HostComponent,
        type: 'div',
        return: parentFiber,
      };

      (div as any)['__reactFiber$test'] = domFiber;

      const info = extractFrameworkInfo(div);

      expect(info.type).toBe('react');
      expect(info.displayName).toBe('ParentComponent');
    });

    it('should collect ancestry chain', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const appFiber = {
        tag: FunctionComponent,
        type: createMockComponent('App'),
        return: null,
      };

      const cardFiber = {
        tag: FunctionComponent,
        type: createMockComponent('Card'),
        return: appFiber,
      };

      const buttonFiber = {
        tag: FunctionComponent,
        type: createMockComponent('Button'),
        return: cardFiber,
      };

      (div as any)['__reactFiber$test'] = buttonFiber;

      const info = extractFrameworkInfo(div);

      expect(info.ancestry).toEqual(['Button', 'Card', 'App']);
    });

    it('should extract React key when present', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const mockFiber = {
        tag: FunctionComponent,
        type: createMockComponent('ListItem'),
        return: null,
        key: 'item-42',
      };

      (div as any)['__reactFiber$test'] = mockFiber;

      const info = extractFrameworkInfo(div);

      expect(info.key).toBe('item-42');
    });

    it('should skip StrictMode and similar internal components', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const appFiber = {
        tag: FunctionComponent,
        type: createMockComponent('App'),
        return: null,
      };

      const strictModeFiber = {
        tag: FunctionComponent,
        type: createMockComponent('StrictMode'),
        return: appFiber,
      };

      const buttonFiber = {
        tag: FunctionComponent,
        type: createMockComponent('Button'),
        return: strictModeFiber,
      };

      (div as any)['__reactFiber$test'] = buttonFiber;

      const info = extractFrameworkInfo(div);

      // The nearest user component should be Button
      expect(info.displayName).toBe('Button');
    });
  });
});

describe('extractHooks', () => {
  it('should extract useState hooks', () => {
    const mockFiber = {
      tag: FunctionComponent,
      type: createMockComponent('Counter'),
      return: null,
      memoizedState: {
        memoizedState: {
          baseState: 42,
          queue: { lastRenderedReducer: { name: 'basicStateReducer' } },
        },
        next: null,
      },
    };

    const hooks = extractHooks(mockFiber as any);

    expect(hooks.length).toBeGreaterThanOrEqual(1);
    expect(hooks[0].name).toBe('useState');
    expect(hooks[0].value).toBe(42);
  });

  it('should extract useRef hooks', () => {
    const mockFiber = {
      tag: FunctionComponent,
      type: createMockComponent('FormInput'),
      return: null,
      memoizedState: {
        memoizedState: { current: null },
        next: null,
      },
    };

    const hooks = extractHooks(mockFiber as any);

    expect(hooks.length).toBeGreaterThanOrEqual(1);
    expect(hooks[0].name).toBe('useRef');
    expect(hooks[0].value).toBeNull();
  });

  it('should handle multiple hooks in a chain', () => {
    const mockFiber = {
      tag: FunctionComponent,
      type: createMockComponent('ComplexComponent'),
      return: null,
      memoizedState: {
        memoizedState: {
          baseState: 'hello',
          queue: { lastRenderedReducer: { name: 'basicStateReducer' } },
        },
        next: {
          memoizedState: { current: null },
          next: null,
        },
      },
    };

    const hooks = extractHooks(mockFiber as any);

    expect(hooks.length).toBe(2);
    expect(hooks[0].name).toBe('useState');
    expect(hooks[1].name).toBe('useRef');
  });

  it('should return empty array for class components', () => {
    const mockFiber = {
      tag: 1, // ClassComponent
      type: createMockComponent('ClassButton'),
      return: null,
      memoizedState: {},
    };

    const hooks = extractHooks(mockFiber as any);

    expect(hooks).toEqual([]);
  });
});

describe('extractContext', () => {
  it('should extract context from Provider ancestors', () => {
    const providerFiber = {
      tag: ContextProvider,
      type: {
        _context: {
          displayName: 'ThemeContext',
        },
      },
      return: null,
      memoizedProps: {
        value: { mode: 'dark' },
      },
    };

    const componentFiber = {
      tag: FunctionComponent,
      type: createMockComponent('Button'),
      return: providerFiber,
    };

    const contexts = extractContext(componentFiber as any);

    expect(contexts.length).toBe(1);
    expect(contexts[0].name).toBe('ThemeContext');
    expect(contexts[0].value).toEqual({ mode: 'dark' });
  });

  it('should collect multiple context providers', () => {
    const authProvider = {
      tag: ContextProvider,
      type: { _context: { displayName: 'AuthContext' } },
      return: null,
      memoizedProps: { value: { user: 'john' } },
    };

    const themeProvider = {
      tag: ContextProvider,
      type: { _context: { displayName: 'ThemeContext' } },
      return: authProvider,
      memoizedProps: { value: { mode: 'light' } },
    };

    const componentFiber = {
      tag: FunctionComponent,
      type: createMockComponent('Header'),
      return: themeProvider,
    };

    const contexts = extractContext(componentFiber as any);

    expect(contexts.length).toBe(2);
    expect(contexts.map(c => c.name)).toContain('ThemeContext');
    expect(contexts.map(c => c.name)).toContain('AuthContext');
  });

  it('should not duplicate contexts', () => {
    const contextType = { displayName: 'TestContext' };

    const provider1 = {
      tag: ContextProvider,
      type: { _context: contextType },
      return: null,
      memoizedProps: { value: 'first' },
    };

    const provider2 = {
      tag: ContextProvider,
      type: { _context: contextType },
      return: provider1,
      memoizedProps: { value: 'second' },
    };

    const componentFiber = {
      tag: FunctionComponent,
      type: createMockComponent('Consumer'),
      return: provider2,
    };

    const contexts = extractContext(componentFiber as any);

    // Should only include the nearest provider (first one encountered)
    expect(contexts.length).toBe(1);
  });
});

describe('getRenderAnalysis', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should return null for vanilla elements', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const analysis = getRenderAnalysis(div);

    expect(analysis).toBeNull();
  });

  it('should detect initial render', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const mockFiber = {
      tag: FunctionComponent,
      type: createMockComponent('Button'),
      return: null,
      alternate: null, // No previous render
    };

    (div as any)['__reactFiber$test'] = mockFiber;

    const analysis = getRenderAnalysis(div);

    expect(analysis).not.toBeNull();
    expect(analysis?.lastRenderReason).toBe('Initial render');
  });

  it('should detect prop changes', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const alternateFiber = {
      tag: FunctionComponent,
      type: createMockComponent('Button'),
      return: null,
      memoizedProps: { count: 1, label: 'old' },
    };

    const mockFiber = {
      tag: FunctionComponent,
      type: createMockComponent('Button'),
      return: null,
      alternate: alternateFiber,
      memoizedProps: { count: 2, label: 'old' },
    };

    (div as any)['__reactFiber$test'] = mockFiber;

    const analysis = getRenderAnalysis(div);

    expect(analysis).not.toBeNull();
    expect(analysis?.changedProps).toContain('count');
    expect(analysis?.lastRenderReason).toContain('Props changed');
  });

  it('should track render count across calls', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const mockFiber = {
      tag: FunctionComponent,
      type: createMockComponent('Counter'),
      return: null,
      alternate: null,
    };

    (div as any)['__reactFiber$test'] = mockFiber;

    const analysis1 = getRenderAnalysis(div);
    const analysis2 = getRenderAnalysis(div);
    const analysis3 = getRenderAnalysis(div);

    expect(analysis1?.renderCount).toBe(1);
    expect(analysis2?.renderCount).toBe(2);
    expect(analysis3?.renderCount).toBe(3);
  });
});
