import { describe, it, expect, beforeEach } from 'vitest';
import { captureSnapshot } from './snapshot.js';

describe('captureSnapshot', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('basic element info', () => {
    it('should capture tag name', () => {
      const button = document.createElement('button');
      document.body.appendChild(button);

      const snapshot = captureSnapshot(button);

      expect(snapshot.tagName).toBe('button');
    });

    it('should capture text content as name', () => {
      const button = document.createElement('button');
      button.textContent = 'Click me';
      document.body.appendChild(button);

      const snapshot = captureSnapshot(button);

      expect(snapshot.name).toBe('Click me');
    });

    it('should truncate long text content', () => {
      const div = document.createElement('div');
      div.textContent = 'A'.repeat(100);
      document.body.appendChild(div);

      const snapshot = captureSnapshot(div);

      expect(snapshot.name).toHaveLength(53); // 50 chars + '...'
      expect(snapshot.name.endsWith('...')).toBe(true);
    });
  });

  describe('element identifiers', () => {
    it('should capture id', () => {
      const div = document.createElement('div');
      div.id = 'my-element';
      document.body.appendChild(div);

      const snapshot = captureSnapshot(div);

      expect(snapshot.id).toBe('my-element');
    });

    it('should capture className', () => {
      const div = document.createElement('div');
      div.className = 'foo bar baz';
      document.body.appendChild(div);

      const snapshot = captureSnapshot(div);

      expect(snapshot.className).toBe('foo bar baz');
    });

    it('should capture data attributes', () => {
      const div = document.createElement('div');
      div.setAttribute('data-testid', 'my-test');
      div.setAttribute('data-value', '42');
      document.body.appendChild(div);

      const snapshot = captureSnapshot(div);

      expect(snapshot.dataAttributes).toEqual({
        'data-testid': 'my-test',
        'data-value': '42',
      });
    });

    it('should not include empty identifiers', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const snapshot = captureSnapshot(div);

      expect(snapshot.id).toBeUndefined();
      expect(snapshot.className).toBeUndefined();
      expect(snapshot.dataAttributes).toBeUndefined();
    });
  });

  describe('role detection', () => {
    it('should use explicit role attribute', () => {
      const div = document.createElement('div');
      div.setAttribute('role', 'navigation');
      document.body.appendChild(div);

      const snapshot = captureSnapshot(div);

      expect(snapshot.role).toBe('navigation');
    });

    it('should infer role from button tag', () => {
      const button = document.createElement('button');
      document.body.appendChild(button);

      const snapshot = captureSnapshot(button);

      expect(snapshot.role).toBe('button');
    });

    it('should infer role from link tag', () => {
      const link = document.createElement('a');
      document.body.appendChild(link);

      const snapshot = captureSnapshot(link);

      expect(snapshot.role).toBe('link');
    });

    it('should infer role from semantic tags', () => {
      const nav = document.createElement('nav');
      document.body.appendChild(nav);

      const snapshot = captureSnapshot(nav);

      expect(snapshot.role).toBe('navigation');
    });

    it('should return generic for unknown tags', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const snapshot = captureSnapshot(div);

      expect(snapshot.role).toBe('generic');
    });

    it('should detect input type as role', () => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      document.body.appendChild(input);

      const snapshot = captureSnapshot(input);

      expect(snapshot.role).toBe('checkbox');
    });
  });

  describe('accessibility info', () => {
    it('should capture aria-label', () => {
      const button = document.createElement('button');
      button.setAttribute('aria-label', 'Close dialog');
      document.body.appendChild(button);

      const snapshot = captureSnapshot(button);

      expect(snapshot.a11y.label).toBe('Close dialog');
      expect(snapshot.name).toBe('Close dialog');
    });

    it('should capture title as label fallback', () => {
      const button = document.createElement('button');
      button.setAttribute('title', 'Helpful tooltip');
      document.body.appendChild(button);

      const snapshot = captureSnapshot(button);

      expect(snapshot.a11y.label).toBe('Helpful tooltip');
    });

    it('should capture aria-describedby', () => {
      const desc = document.createElement('span');
      desc.id = 'desc-text';
      desc.textContent = 'This is the description';
      document.body.appendChild(desc);

      const button = document.createElement('button');
      button.setAttribute('aria-describedby', 'desc-text');
      document.body.appendChild(button);

      const snapshot = captureSnapshot(button);

      expect(snapshot.a11y.description).toBe('This is the description');
    });

    it('should capture disabled state from aria-disabled', () => {
      const button = document.createElement('button');
      button.setAttribute('aria-disabled', 'true');
      document.body.appendChild(button);

      const snapshot = captureSnapshot(button);

      expect(snapshot.a11y.disabled).toBe(true);
    });

    it('should capture disabled state from disabled attribute', () => {
      const button = document.createElement('button');
      button.disabled = true;
      document.body.appendChild(button);

      const snapshot = captureSnapshot(button);

      expect(snapshot.a11y.disabled).toBe(true);
    });

    it('should capture aria-expanded', () => {
      const button = document.createElement('button');
      button.setAttribute('aria-expanded', 'true');
      document.body.appendChild(button);

      const snapshot = captureSnapshot(button);

      expect(snapshot.a11y.expanded).toBe(true);
    });

    it('should capture aria-checked states', () => {
      const checkbox1 = document.createElement('input');
      checkbox1.type = 'checkbox';
      checkbox1.setAttribute('aria-checked', 'true');
      document.body.appendChild(checkbox1);

      const checkbox2 = document.createElement('input');
      checkbox2.type = 'checkbox';
      checkbox2.setAttribute('aria-checked', 'mixed');
      document.body.appendChild(checkbox2);

      expect(captureSnapshot(checkbox1).a11y.checked).toBe(true);
      expect(captureSnapshot(checkbox2).a11y.checked).toBe('mixed');
    });

    it('should capture hidden state', () => {
      const div = document.createElement('div');
      div.setAttribute('aria-hidden', 'true');
      document.body.appendChild(div);

      const snapshot = captureSnapshot(div);

      expect(snapshot.a11y.hidden).toBe(true);
    });
  });

  describe('accessible name computation', () => {
    it('should use aria-labelledby', () => {
      const label = document.createElement('span');
      label.id = 'my-label';
      label.textContent = 'Field Label';
      document.body.appendChild(label);

      const input = document.createElement('input');
      input.setAttribute('aria-labelledby', 'my-label');
      document.body.appendChild(input);

      const snapshot = captureSnapshot(input);

      expect(snapshot.name).toBe('Field Label');
    });

    it('should use associated label for inputs', () => {
      const label = document.createElement('label');
      label.setAttribute('for', 'my-input');
      label.textContent = 'Email Address';
      document.body.appendChild(label);

      const input = document.createElement('input');
      input.id = 'my-input';
      document.body.appendChild(input);

      const snapshot = captureSnapshot(input);

      expect(snapshot.name).toBe('Email Address');
    });

    it('should use alt text for images', () => {
      const img = document.createElement('img');
      img.alt = 'Company logo';
      document.body.appendChild(img);

      const snapshot = captureSnapshot(img);

      expect(snapshot.name).toBe('Company logo');
    });
  });

  describe('geometry', () => {
    it('should capture bounding rect', () => {
      const div = document.createElement('div');
      div.style.width = '200px';
      div.style.height = '100px';
      document.body.appendChild(div);

      const snapshot = captureSnapshot(div);

      expect(snapshot.geometry.width).toBeGreaterThanOrEqual(0);
      expect(snapshot.geometry.height).toBeGreaterThanOrEqual(0);
      expect(typeof snapshot.geometry.x).toBe('number');
      expect(typeof snapshot.geometry.y).toBe('number');
    });

    it('should mark zero-size elements as not visible', () => {
      const div = document.createElement('div');
      div.style.width = '0px';
      div.style.height = '0px';
      document.body.appendChild(div);

      const snapshot = captureSnapshot(div);

      expect(snapshot.geometry.visible).toBe(false);
    });
  });

  describe('styles', () => {
    it('should capture display', () => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      document.body.appendChild(div);

      const snapshot = captureSnapshot(div);

      expect(snapshot.styles.display).toBe('flex');
    });

    it('should capture position', () => {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      document.body.appendChild(div);

      const snapshot = captureSnapshot(div);

      expect(snapshot.styles.position).toBe('absolute');
    });

    it('should capture flex direction when not default', () => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.flexDirection = 'column';
      document.body.appendChild(div);

      const snapshot = captureSnapshot(div);

      expect(snapshot.styles.flexDirection).toBe('column');
    });

    it('should capture colors', () => {
      const div = document.createElement('div');
      div.style.color = 'red';
      div.style.backgroundColor = 'blue';
      document.body.appendChild(div);

      const snapshot = captureSnapshot(div);

      expect(snapshot.styles.color).toBeDefined();
      expect(snapshot.styles.backgroundColor).toBeDefined();
    });
  });

  describe('framework detection', () => {
    it('should default to vanilla when no framework detected', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const snapshot = captureSnapshot(div);

      expect(snapshot.framework.name).toBe('vanilla');
    });
  });

  describe('metadata', () => {
    it('should include timestamp', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const before = Date.now();
      const snapshot = captureSnapshot(div);
      const after = Date.now();

      expect(snapshot.timestamp).toBeGreaterThanOrEqual(before);
      expect(snapshot.timestamp).toBeLessThanOrEqual(after);
    });

    it('should include URL', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const snapshot = captureSnapshot(div);

      expect(snapshot.url).toBe(window.location.href);
    });
  });
});
