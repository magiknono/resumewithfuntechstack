
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function create_slot(definition, ctx, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
            : ctx.$$scope.ctx;
    }
    function get_slot_changes(definition, ctx, changed, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
            : ctx.$$scope.changed || {};
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    let running = false;
    function run_tasks() {
        tasks.forEach(task => {
            if (!task[0](now())) {
                tasks.delete(task);
                task[1]();
            }
        });
        running = tasks.size > 0;
        if (running)
            raf(run_tasks);
    }
    function loop(fn) {
        let task;
        if (!running) {
            running = true;
            raf(run_tasks);
        }
        return {
            promise: new Promise(fulfil => {
                tasks.add(task = [fn, fulfil]);
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let stylesheet;
    let active = 0;
    let current_rules = {};
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        if (!current_rules[name]) {
            if (!stylesheet) {
                const style = element('style');
                document.head.appendChild(style);
                stylesheet = style.sheet;
            }
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        node.style.animation = (node.style.animation || '')
            .split(', ')
            .filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        )
            .join(', ');
        if (name && !--active)
            clear_rules();
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            current_rules = {};
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = current_component;
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, changed, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(changed, child_ctx);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/UI/WrapperGrid.svelte generated by Svelte v3.12.1 */

    const file = "src/UI/WrapperGrid.svelte";

    function create_fragment(ctx) {
    	var div, current;

    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			div = element("div");

    			if (default_slot) default_slot.c();

    			attr_dev(div, "class", "wrapper svelte-1h5tlc1");
    			set_style(div, "--areas", ctx.customAreas);
    			add_location(div, file, 27, 0, 619);
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(div_nodes);
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(
    					get_slot_changes(default_slot_template, ctx, changed, null),
    					get_slot_context(default_slot_template, ctx, null)
    				);
    			}

    			if (!current || changed.customAreas) {
    				set_style(div, "--areas", ctx.customAreas);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { customAreas } = $$props;

    	const writable_props = ['customAreas'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<WrapperGrid> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ('customAreas' in $$props) $$invalidate('customAreas', customAreas = $$props.customAreas);
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { customAreas };
    	};

    	$$self.$inject_state = $$props => {
    		if ('customAreas' in $$props) $$invalidate('customAreas', customAreas = $$props.customAreas);
    	};

    	return { customAreas, $$slots, $$scope };
    }

    class WrapperGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["customAreas"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "WrapperGrid", options, id: create_fragment.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.customAreas === undefined && !('customAreas' in props)) {
    			console.warn("<WrapperGrid> was created without expected prop 'customAreas'");
    		}
    	}

    	get customAreas() {
    		throw new Error("<WrapperGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set customAreas(value) {
    		throw new Error("<WrapperGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quintOut(t) {
        return --t * t * t * t * t + 1;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut }) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => `overflow: hidden;` +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src/UI/LayoutMenu.svelte generated by Svelte v3.12.1 */

    const file$1 = "src/UI/LayoutMenu.svelte";

    function create_fragment$1(ctx) {
    	var div, t, button, div_transition, current, dispose;

    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			div = element("div");

    			if (default_slot) default_slot.c();
    			t = space();
    			button = element("button");
    			button.textContent = "Close";

    			attr_dev(button, "class", "nes-btn");
    			add_location(button, file$1, 33, 4, 782);
    			attr_dev(div, "class", "layout-menu svelte-1i90or8");
    			add_location(div, file$1, 31, 0, 665);
    			dispose = listen_dev(button, "click", ctx.layoutMenuClose);
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(div_nodes);
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t);
    			append_dev(div, button);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(
    					get_slot_changes(default_slot_template, ctx, changed, null),
    					get_slot_context(default_slot_template, ctx, null)
    				);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {delay: 100, duration: 1500, easing: quintOut }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);

    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, {delay: 100, duration: 1500, easing: quintOut }, false);
    			div_transition.run(0);

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			if (default_slot) default_slot.d(detaching);

    			if (detaching) {
    				if (div_transition) div_transition.end();
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	


    const dispatch = createEventDispatcher();

    function layoutMenuClose() {
        dispatch('close');
    }

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {};

    	return { layoutMenuClose, $$slots, $$scope };
    }

    class LayoutMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "LayoutMenu", options, id: create_fragment$1.name });
    	}
    }

    /* src/USERS/UserHero1.svelte generated by Svelte v3.12.1 */

    const file$2 = "src/USERS/UserHero1.svelte";

    function create_fragment$2(ctx) {
    	var img;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "src", ctx.avatarUrl);
    			attr_dev(img, "alt", "#");
    			add_location(img, file$2, 4, 0, 46);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.avatarUrl) {
    				attr_dev(img, "src", ctx.avatarUrl);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(img);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { avatarUrl } = $$props;

    	const writable_props = ['avatarUrl'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<UserHero1> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('avatarUrl' in $$props) $$invalidate('avatarUrl', avatarUrl = $$props.avatarUrl);
    	};

    	$$self.$capture_state = () => {
    		return { avatarUrl };
    	};

    	$$self.$inject_state = $$props => {
    		if ('avatarUrl' in $$props) $$invalidate('avatarUrl', avatarUrl = $$props.avatarUrl);
    	};

    	return { avatarUrl };
    }

    class UserHero1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["avatarUrl"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "UserHero1", options, id: create_fragment$2.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.avatarUrl === undefined && !('avatarUrl' in props)) {
    			console.warn("<UserHero1> was created without expected prop 'avatarUrl'");
    		}
    	}

    	get avatarUrl() {
    		throw new Error("<UserHero1>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set avatarUrl(value) {
    		throw new Error("<UserHero1>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/USERS/UserHero2.svelte generated by Svelte v3.12.1 */

    const file$3 = "src/USERS/UserHero2.svelte";

    function create_fragment$3(ctx) {
    	var h1, t0, t1, t2, t3, h2, t4;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(ctx.firstName);
    			t1 = space();
    			t2 = text(ctx.lastName);
    			t3 = space();
    			h2 = element("h2");
    			t4 = text(ctx.headline);
    			add_location(h1, file$3, 5, 4, 99);
    			add_location(h2, file$3, 6, 4, 135);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t4);
    		},

    		p: function update(changed, ctx) {
    			if (changed.firstName) {
    				set_data_dev(t0, ctx.firstName);
    			}

    			if (changed.lastName) {
    				set_data_dev(t2, ctx.lastName);
    			}

    			if (changed.headline) {
    				set_data_dev(t4, ctx.headline);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(h1);
    				detach_dev(t3);
    				detach_dev(h2);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$3.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { firstName, lastName, headline } = $$props;

    	const writable_props = ['firstName', 'lastName', 'headline'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<UserHero2> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('firstName' in $$props) $$invalidate('firstName', firstName = $$props.firstName);
    		if ('lastName' in $$props) $$invalidate('lastName', lastName = $$props.lastName);
    		if ('headline' in $$props) $$invalidate('headline', headline = $$props.headline);
    	};

    	$$self.$capture_state = () => {
    		return { firstName, lastName, headline };
    	};

    	$$self.$inject_state = $$props => {
    		if ('firstName' in $$props) $$invalidate('firstName', firstName = $$props.firstName);
    		if ('lastName' in $$props) $$invalidate('lastName', lastName = $$props.lastName);
    		if ('headline' in $$props) $$invalidate('headline', headline = $$props.headline);
    	};

    	return { firstName, lastName, headline };
    }

    class UserHero2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, ["firstName", "lastName", "headline"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "UserHero2", options, id: create_fragment$3.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.firstName === undefined && !('firstName' in props)) {
    			console.warn("<UserHero2> was created without expected prop 'firstName'");
    		}
    		if (ctx.lastName === undefined && !('lastName' in props)) {
    			console.warn("<UserHero2> was created without expected prop 'lastName'");
    		}
    		if (ctx.headline === undefined && !('headline' in props)) {
    			console.warn("<UserHero2> was created without expected prop 'headline'");
    		}
    	}

    	get firstName() {
    		throw new Error("<UserHero2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set firstName(value) {
    		throw new Error("<UserHero2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lastName() {
    		throw new Error("<UserHero2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lastName(value) {
    		throw new Error("<UserHero2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get headline() {
    		throw new Error("<UserHero2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headline(value) {
    		throw new Error("<UserHero2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/USERS/UserJob.svelte generated by Svelte v3.12.1 */

    const file$4 = "src/USERS/UserJob.svelte";

    function create_fragment$4(ctx) {
    	var section, img, t0, div0, h4, t1, t2, h5, span, t3, t4, p0, t5, t6, div1, p1, t7;

    	const block = {
    		c: function create() {
    			section = element("section");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			h4 = element("h4");
    			t1 = text(ctx.jobCompany);
    			t2 = space();
    			h5 = element("h5");
    			span = element("span");
    			t3 = text(ctx.jobTitle);
    			t4 = space();
    			p0 = element("p");
    			t5 = text(ctx.jobDesc);
    			t6 = space();
    			div1 = element("div");
    			p1 = element("p");
    			t7 = text(ctx.jobTime);
    			attr_dev(img, "src", ctx.jobImage);
    			attr_dev(img, "alt", "#");
    			attr_dev(img, "class", "svelte-1avu7ip");
    			add_location(img, file$4, 24, 4, 391);
    			add_location(h4, file$4, 26, 8, 460);
    			add_location(span, file$4, 27, 12, 494);
    			add_location(h5, file$4, 27, 8, 490);
    			add_location(p0, file$4, 28, 8, 531);
    			attr_dev(div0, "class", "job-desc svelte-1avu7ip");
    			add_location(div0, file$4, 25, 4, 429);
    			add_location(p1, file$4, 31, 8, 594);
    			attr_dev(div1, "class", "job-time svelte-1avu7ip");
    			add_location(div1, file$4, 30, 4, 563);
    			attr_dev(section, "class", "job svelte-1avu7ip");
    			add_location(section, file$4, 23, 0, 365);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, img);
    			append_dev(section, t0);
    			append_dev(section, div0);
    			append_dev(div0, h4);
    			append_dev(h4, t1);
    			append_dev(div0, t2);
    			append_dev(div0, h5);
    			append_dev(h5, span);
    			append_dev(span, t3);
    			append_dev(div0, t4);
    			append_dev(div0, p0);
    			append_dev(p0, t5);
    			append_dev(section, t6);
    			append_dev(section, div1);
    			append_dev(div1, p1);
    			append_dev(p1, t7);
    		},

    		p: function update(changed, ctx) {
    			if (changed.jobImage) {
    				attr_dev(img, "src", ctx.jobImage);
    			}

    			if (changed.jobCompany) {
    				set_data_dev(t1, ctx.jobCompany);
    			}

    			if (changed.jobTitle) {
    				set_data_dev(t3, ctx.jobTitle);
    			}

    			if (changed.jobDesc) {
    				set_data_dev(t5, ctx.jobDesc);
    			}

    			if (changed.jobTime) {
    				set_data_dev(t7, ctx.jobTime);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(section);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$4.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { jobCompany, jobImage, jobTitle, jobDesc, jobTime } = $$props;

    	const writable_props = ['jobCompany', 'jobImage', 'jobTitle', 'jobDesc', 'jobTime'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<UserJob> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('jobCompany' in $$props) $$invalidate('jobCompany', jobCompany = $$props.jobCompany);
    		if ('jobImage' in $$props) $$invalidate('jobImage', jobImage = $$props.jobImage);
    		if ('jobTitle' in $$props) $$invalidate('jobTitle', jobTitle = $$props.jobTitle);
    		if ('jobDesc' in $$props) $$invalidate('jobDesc', jobDesc = $$props.jobDesc);
    		if ('jobTime' in $$props) $$invalidate('jobTime', jobTime = $$props.jobTime);
    	};

    	$$self.$capture_state = () => {
    		return { jobCompany, jobImage, jobTitle, jobDesc, jobTime };
    	};

    	$$self.$inject_state = $$props => {
    		if ('jobCompany' in $$props) $$invalidate('jobCompany', jobCompany = $$props.jobCompany);
    		if ('jobImage' in $$props) $$invalidate('jobImage', jobImage = $$props.jobImage);
    		if ('jobTitle' in $$props) $$invalidate('jobTitle', jobTitle = $$props.jobTitle);
    		if ('jobDesc' in $$props) $$invalidate('jobDesc', jobDesc = $$props.jobDesc);
    		if ('jobTime' in $$props) $$invalidate('jobTime', jobTime = $$props.jobTime);
    	};

    	return {
    		jobCompany,
    		jobImage,
    		jobTitle,
    		jobDesc,
    		jobTime
    	};
    }

    class UserJob extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, ["jobCompany", "jobImage", "jobTitle", "jobDesc", "jobTime"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "UserJob", options, id: create_fragment$4.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.jobCompany === undefined && !('jobCompany' in props)) {
    			console.warn("<UserJob> was created without expected prop 'jobCompany'");
    		}
    		if (ctx.jobImage === undefined && !('jobImage' in props)) {
    			console.warn("<UserJob> was created without expected prop 'jobImage'");
    		}
    		if (ctx.jobTitle === undefined && !('jobTitle' in props)) {
    			console.warn("<UserJob> was created without expected prop 'jobTitle'");
    		}
    		if (ctx.jobDesc === undefined && !('jobDesc' in props)) {
    			console.warn("<UserJob> was created without expected prop 'jobDesc'");
    		}
    		if (ctx.jobTime === undefined && !('jobTime' in props)) {
    			console.warn("<UserJob> was created without expected prop 'jobTime'");
    		}
    	}

    	get jobCompany() {
    		throw new Error("<UserJob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set jobCompany(value) {
    		throw new Error("<UserJob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get jobImage() {
    		throw new Error("<UserJob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set jobImage(value) {
    		throw new Error("<UserJob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get jobTitle() {
    		throw new Error("<UserJob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set jobTitle(value) {
    		throw new Error("<UserJob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get jobDesc() {
    		throw new Error("<UserJob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set jobDesc(value) {
    		throw new Error("<UserJob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get jobTime() {
    		throw new Error("<UserJob>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set jobTime(value) {
    		throw new Error("<UserJob>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/UI/BullshitGrid.svelte generated by Svelte v3.12.1 */

    const file$5 = "src/UI/BullshitGrid.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.card = list[i];
    	return child_ctx;
    }

    // (127:12) {#if visible}
    function create_if_block(ctx) {
    	var img, img_src_value, img_alt_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "active svelte-nwqn0n");
    			attr_dev(img, "src", img_src_value = ctx.card.imageUrl);
    			attr_dev(img, "alt", img_alt_value = console.log(ctx.card.id, ctx.card));
    			add_location(img, file$5, 127, 12, 4630);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.cards) && img_src_value !== (img_src_value = ctx.card.imageUrl)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((changed.cards) && img_alt_value !== (img_alt_value = console.log(ctx.card.id, ctx.card))) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(img);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block.name, type: "if", source: "(127:12) {#if visible}", ctx });
    	return block;
    }

    // (121:4) {#each cards.filter(c=> !c.selected) as card (card.id)}
    function create_each_block(key_1, ctx) {
    	var div, div_id_value, div_transition, current, dispose;

    	var if_block = (ctx.visible) && create_if_block(ctx);

    	function click_handler() {
    		return ctx.click_handler(ctx);
    	}

    	const block = {
    		key: key_1,

    		first: null,

    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "beer svelte-nwqn0n");
    			attr_dev(div, "id", div_id_value = ctx.card.id);
    			add_location(div, file$5, 121, 8, 4276);

    			dispose = [
    				listen_dev(div, "introstart", ctx.introstart_handler),
    				listen_dev(div, "outrostart", ctx.outrostart_handler),
    				listen_dev(div, "introend", ctx.introend_handler),
    				listen_dev(div, "outroend", ctx.outroend_handler),
    				listen_dev(div, "click", click_handler)
    			];

    			this.first = div;
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if (ctx.visible) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if ((!current || changed.cards) && div_id_value !== (div_id_value = ctx.card.id)) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: 200, duration: 1000 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},

    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: 200, duration: 1000 }, false);
    			div_transition.run(0);

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			if (if_block) if_block.d();

    			if (detaching) {
    				if (div_transition) div_transition.end();
    			}

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(121:4) {#each cards.filter(c=> !c.selected) as card (card.id)}", ctx });
    	return block;
    }

    function create_fragment$5(ctx) {
    	var link, t0, div3, div0, label, t1, t2, t3, t4, t5, t6, t7, input0, t8, button, t9, t10, input1, t11, div1, h10, t12, t13, each_blocks = [], each_1_lookup = new Map(), t14, div2, h11, current, dispose;

    	let each_value = ctx.cards.filter(func);

    	const get_key = ctx => ctx.card.id;

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			link = element("link");
    			t0 = space();
    			div3 = element("div");
    			div0 = element("div");
    			label = element("label");
    			t1 = text("pause: il est ");
    			t2 = text(ctx.hours);
    			t3 = text(":");
    			t4 = text(ctx.minutes);
    			t5 = text(" et ");
    			t6 = text(ctx.seconds);
    			t7 = text("s - Afficher toutes les cartes \n            ");
    			input0 = element("input");
    			t8 = space();
    			button = element("button");
    			t9 = text(ctx.status);
    			t10 = space();
    			input1 = element("input");
    			t11 = space();
    			div1 = element("div");
    			h10 = element("h1");
    			t12 = text(ctx.inputValue);
    			t13 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t14 = space();
    			div2 = element("div");
    			h11 = element("h1");
    			h11.textContent = "RANDOM POKER PAUSE";
    			attr_dev(link, "href", "https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap");
    			attr_dev(link, "rel", "stylesheet");
    			add_location(link, file$5, 2, 1, 17);
    			attr_dev(input0, "type", "checkbox");
    			add_location(input0, file$5, 114, 12, 3968);
    			add_location(label, file$5, 113, 8, 3873);
    			add_location(button, file$5, 116, 8, 4040);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$5, 117, 8, 4093);
    			attr_dev(div0, "class", "tools svelte-nwqn0n");
    			add_location(div0, file$5, 112, 4, 3845);
    			attr_dev(h10, "class", "svelte-nwqn0n");
    			add_location(h10, file$5, 119, 30, 4180);
    			attr_dev(div1, "class", "tapis-title1 svelte-nwqn0n");
    			add_location(div1, file$5, 119, 4, 4154);
    			attr_dev(h11, "class", "svelte-nwqn0n");
    			add_location(h11, file$5, 131, 30, 4785);
    			attr_dev(div2, "class", "tapis-title2 svelte-nwqn0n");
    			add_location(div2, file$5, 131, 4, 4759);
    			attr_dev(div3, "class", "wrapper svelte-nwqn0n");
    			add_location(div3, file$5, 111, 0, 3819);

    			dispose = [
    				listen_dev(input0, "change", ctx.input0_change_handler),
    				listen_dev(button, "click", ctx.shuffle),
    				listen_dev(input1, "input", ctx.input1_input_handler)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			append_dev(document.head, link);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, label);
    			append_dev(label, t1);
    			append_dev(label, t2);
    			append_dev(label, t3);
    			append_dev(label, t4);
    			append_dev(label, t5);
    			append_dev(label, t6);
    			append_dev(label, t7);
    			append_dev(label, input0);

    			input0.checked = ctx.visible;

    			append_dev(div0, t8);
    			append_dev(div0, button);
    			append_dev(button, t9);
    			append_dev(div0, t10);
    			append_dev(div0, input1);

    			set_input_value(input1, ctx.inputValue);

    			append_dev(div3, t11);
    			append_dev(div3, div1);
    			append_dev(div1, h10);
    			append_dev(h10, t12);
    			append_dev(div3, t13);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			append_dev(div3, t14);
    			append_dev(div3, div2);
    			append_dev(div2, h11);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (!current || changed.hours) {
    				set_data_dev(t2, ctx.hours);
    			}

    			if (!current || changed.minutes) {
    				set_data_dev(t4, ctx.minutes);
    			}

    			if (!current || changed.seconds) {
    				set_data_dev(t6, ctx.seconds);
    			}

    			if (changed.visible) input0.checked = ctx.visible;

    			if (!current || changed.status) {
    				set_data_dev(t9, ctx.status);
    			}

    			if (changed.inputValue && (input1.value !== ctx.inputValue)) set_input_value(input1, ctx.inputValue);

    			if (!current || changed.inputValue) {
    				set_data_dev(t12, ctx.inputValue);
    			}

    			const each_value = ctx.cards.filter(func);

    			group_outros();
    			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, div3, outro_and_destroy_block, create_each_block, t14, get_each_context);
    			check_outros();
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			detach_dev(link);

    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(div3);
    			}

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$5.name, type: "component", source: "", ctx });
    	return block;
    }

    const func = (c) => !c.selected;

    function instance$5($$self, $$props, $$invalidate) {
    	

    let time = new Date();

    onMount(() => {
    		const interval = setInterval(() => {
    			$$invalidate('time', time = new Date());
    		}, 1000);

    		return () => {
    			clearInterval(interval);
            };
    	});
    let cards = [
        { id: 1, imageUrl: 'images/1.jpeg', selected: false },
        { id: 2, imageUrl: 'images/2.jpeg', selected: false },
        { id: 3, imageUrl: 'images/3.jpeg', selected: false },
        { id: 4, imageUrl: 'images/4.jpeg', selected: false },
        { id: 5, imageUrl: 'images/5.jpeg', selected: false }

     
    ];
    function mark(card, selected) {
        $$invalidate('cards', cards = [card, ...cards]);
        if (cards.length === 10) {
            $$invalidate('visible', visible = true);
        } else {
        card.selected = true;
        $$invalidate('cards', cards = cards.filter(c => c !== selected));
        }
    }
    function shuffle() {
        $$invalidate('cards', cards = cards.sort(() => Math.random() - 0.5));
        
    }

    let visible = false;
    let status = 'pret à mélanger...';

    let inputValue = '';

    	function input0_change_handler() {
    		visible = this.checked;
    		$$invalidate('visible', visible);
    	}

    	function input1_input_handler() {
    		inputValue = this.value;
    		$$invalidate('inputValue', inputValue);
    	}

    	const introstart_handler = () => $$invalidate('status', status = 'prêt à mélanger');

    	const outrostart_handler = () => $$invalidate('status', status = 'ca mélange');

    	const introend_handler = () => $$invalidate('status', status = 'mélanger encore');

    	const outroend_handler = () => $$invalidate('status', status = 'c est melangé');

    	const click_handler = ({ card }) => mark(card, false);

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('time' in $$props) $$invalidate('time', time = $$props.time);
    		if ('cards' in $$props) $$invalidate('cards', cards = $$props.cards);
    		if ('visible' in $$props) $$invalidate('visible', visible = $$props.visible);
    		if ('status' in $$props) $$invalidate('status', status = $$props.status);
    		if ('inputValue' in $$props) $$invalidate('inputValue', inputValue = $$props.inputValue);
    		if ('hours' in $$props) $$invalidate('hours', hours = $$props.hours);
    		if ('minutes' in $$props) $$invalidate('minutes', minutes = $$props.minutes);
    		if ('seconds' in $$props) $$invalidate('seconds', seconds = $$props.seconds);
    	};

    	let hours, minutes, seconds;

    	$$self.$$.update = ($$dirty = { time: 1 }) => {
    		if ($$dirty.time) { $$invalidate('hours', hours = time.getHours()); }
    		if ($$dirty.time) { $$invalidate('minutes', minutes = time.getMinutes()); }
    		if ($$dirty.time) { $$invalidate('seconds', seconds = time.getSeconds()); }
    	};

    	return {
    		cards,
    		mark,
    		shuffle,
    		visible,
    		status,
    		inputValue,
    		hours,
    		minutes,
    		seconds,
    		input0_change_handler,
    		input1_input_handler,
    		introstart_handler,
    		outrostart_handler,
    		introend_handler,
    		outroend_handler,
    		click_handler
    	};
    }

    class BullshitGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "BullshitGrid", options, id: create_fragment$5.name });
    	}
    }

    /* src/THEMES/WireframeTheme.svelte generated by Svelte v3.12.1 */

    const file$6 = "src/THEMES/WireframeTheme.svelte";

    function create_fragment$6(ctx) {
    	var link0, link1;

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			attr_dev(link0, "href", "https://fonts.googleapis.com/css?family=Nunito+Sans&display=swap");
    			attr_dev(link0, "rel", "stylesheet");
    			add_location(link0, file$6, 1, 4, 19);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "href", "/wireframe.css");
    			add_location(link1, file$6, 2, 1, 117);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			append_dev(document.head, link0);
    			append_dev(document.head, link1);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			detach_dev(link0);
    			detach_dev(link1);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$6.name, type: "component", source: "", ctx });
    	return block;
    }

    class WireframeTheme extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$6, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "WireframeTheme", options, id: create_fragment$6.name });
    	}
    }

    /* src/THEMES/NesTheme.svelte generated by Svelte v3.12.1 */

    const file$7 = "src/THEMES/NesTheme.svelte";

    function create_fragment$7(ctx) {
    	var link0, link1;

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			attr_dev(link0, "href", "https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap");
    			attr_dev(link0, "rel", "stylesheet");
    			add_location(link0, file$7, 1, 2, 16);
    			attr_dev(link1, "href", "https://unpkg.com/nes.css/css/nes.css");
    			attr_dev(link1, "rel", "stylesheet");
    			add_location(link1, file$7, 2, 5, 122);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			append_dev(document.head, link0);
    			append_dev(document.head, link1);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			detach_dev(link0);
    			detach_dev(link1);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$7.name, type: "component", source: "", ctx });
    	return block;
    }

    class NesTheme extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$7, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "NesTheme", options, id: create_fragment$7.name });
    	}
    }

    /* src/THEMES/CulrsTheme.svelte generated by Svelte v3.12.1 */

    const file$8 = "src/THEMES/CulrsTheme.svelte";

    function create_fragment$8(ctx) {
    	var link0, link1;

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			attr_dev(link0, "href", "https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap");
    			attr_dev(link0, "rel", "stylesheet");
    			add_location(link0, file$8, 1, 4, 19);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "href", "/culrs.css");
    			add_location(link1, file$8, 2, 1, 117);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			append_dev(document.head, link0);
    			append_dev(document.head, link1);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			detach_dev(link0);
    			detach_dev(link1);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$8.name, type: "component", source: "", ctx });
    	return block;
    }

    class CulrsTheme extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$8, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "CulrsTheme", options, id: create_fragment$8.name });
    	}
    }

    /* src/App.svelte generated by Svelte v3.12.1 */

    const file$9 = "src/App.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.job = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.theme = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.user = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.d = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.l = list[i];
    	child_ctx.i = i;
    	return child_ctx;
    }

    // (297:0) {#if layoutMenuVisible}
    function create_if_block_1(ctx) {
    	var current;

    	var layoutmenu = new LayoutMenu({
    		props: {
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});
    	layoutmenu.$on("close", (ctx.layoutMenuClose));

    	const block = {
    		c: function create() {
    			layoutmenu.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(layoutmenu, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var layoutmenu_changes = {};
    			if (changed.$$scope) layoutmenu_changes.$$scope = { changed, ctx };
    			layoutmenu.$set(layoutmenu_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(layoutmenu.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(layoutmenu.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(layoutmenu, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1.name, type: "if", source: "(297:0) {#if layoutMenuVisible}", ctx });
    	return block;
    }

    // (300:3) {#each layouts as l, i}
    function create_each_block_4(ctx) {
    	var li, button, img, dispose;

    	function click_handler() {
    		return ctx.click_handler(ctx);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			img = element("img");
    			attr_dev(img, "src", "layouts/l" + ctx.i + ".png");
    			attr_dev(img, "alt", "layout");
    			add_location(img, file$9, 300, 66, 8010);
    			attr_dev(button, "class", "btn-l svelte-qyvlsf");
    			add_location(button, file$9, 300, 8, 7952);
    			attr_dev(li, "class", "svelte-qyvlsf");
    			add_location(li, file$9, 300, 4, 7948);
    			dispose = listen_dev(button, "click", click_handler);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			append_dev(button, img);
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(li);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block_4.name, type: "each", source: "(300:3) {#each layouts as l, i}", ctx });
    	return block;
    }

    // (298:1) <LayoutMenu on:close={(layoutMenuClose)}>
    function create_default_slot_1(ctx) {
    	var ul;

    	let each_value_4 = ctx.layouts;

    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr_dev(ul, "class", "layout-menu-choices svelte-qyvlsf");
    			add_location(ul, file$9, 298, 2, 7884);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},

    		p: function update(changed, ctx) {
    			if (changed.layouts) {
    				each_value_4 = ctx.layouts;

    				let i;
    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value_4.length;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(ul);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_1.name, type: "slot", source: "(298:1) <LayoutMenu on:close={(layoutMenuClose)}>", ctx });
    	return block;
    }

    // (309:0) {:else}
    function create_else_block(ctx) {
    	var div, div_class_value, current;

    	var wrappergrid = new WrapperGrid({
    		props: {
    		customAreas: ctx.selectedLayout,
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			wrappergrid.$$.fragment.c();
    			attr_dev(div, "class", div_class_value = "" + null_to_empty(ctx.selectedTheme.bg) + " svelte-qyvlsf");
    			add_location(div, file$9, 309, 0, 8150);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(wrappergrid, div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var wrappergrid_changes = {};
    			if (changed.selectedLayout) wrappergrid_changes.customAreas = ctx.selectedLayout;
    			if (changed.$$scope || changed.selectedTheme || changed.selectedJobs || changed.selectedUser || changed.getLucky || changed.datas) wrappergrid_changes.$$scope = { changed, ctx };
    			wrappergrid.$set(wrappergrid_changes);

    			if ((!current || changed.selectedTheme) && div_class_value !== (div_class_value = "" + null_to_empty(ctx.selectedTheme.bg) + " svelte-qyvlsf")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(wrappergrid.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(wrappergrid.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			destroy_component(wrappergrid);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block.name, type: "else", source: "(309:0) {:else}", ctx });
    	return block;
    }

    // (307:0) {#if getLucky}
    function create_if_block$1(ctx) {
    	var current;

    	var bullshitgrid = new BullshitGrid({ $$inline: true });

    	const block = {
    		c: function create() {
    			bullshitgrid.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(bullshitgrid, target, anchor);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(bullshitgrid.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(bullshitgrid.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(bullshitgrid, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$1.name, type: "if", source: "(307:0) {#if getLucky}", ctx });
    	return block;
    }

    // (312:0) {#each datas as d}
    function create_each_block_3(ctx) {
    	var t0_value = ctx.d.email + "", t0, t1, t2_value = ctx.d.first_name + "", t2;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.datas) && t0_value !== (t0_value = ctx.d.email + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if ((changed.datas) && t2_value !== (t2_value = ctx.d.first_name + "")) {
    				set_data_dev(t2, t2_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(t1);
    				detach_dev(t2);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block_3.name, type: "each", source: "(312:0) {#each datas as d}", ctx });
    	return block;
    }

    // (330:4) {#each themes as theme}
    function create_each_block_2(ctx) {
    	var option, t_value = ctx.theme.name + "", t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = ctx.theme;
    			option.value = option.__value;
    			add_location(option, file$9, 330, 5, 8728);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(option);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block_2.name, type: "each", source: "(330:4) {#each themes as theme}", ctx });
    	return block;
    }

    // (318:1) {#each selectedUser as user}
    function create_each_block_1(ctx) {
    	var article0, article0_class_value, t0, article1, t1, button0, t2, button0_class_value, t3, select, t4, t5, button1, t7, label, t8, input, article1_class_value, current, dispose;

    	var userhero1 = new UserHero1({
    		props: { avatarUrl: ctx.user.avatarUrl },
    		$$inline: true
    	});

    	var userhero2 = new UserHero2({
    		props: {
    		firstName: ctx.user.firstName,
    		lastName: ctx.user.lastName,
    		headline: ctx.user.headline
    	},
    		$$inline: true
    	});

    	let each_value_2 = ctx.themes;

    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	var switch_value = ctx.selectedTheme.component;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			article0 = element("article");
    			userhero1.$$.fragment.c();
    			t0 = space();
    			article1 = element("article");
    			userhero2.$$.fragment.c();
    			t1 = space();
    			button0 = element("button");
    			t2 = text("Choose Layout");
    			t3 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			if (switch_instance) switch_instance.$$.fragment.c();
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "getRealData";
    			t7 = space();
    			label = element("label");
    			t8 = text("PAUSE ? >\n\t\t\t\t");
    			input = element("input");
    			attr_dev(article0, "class", article0_class_value = "" + null_to_empty(ctx.selectedTheme.hero1) + " svelte-qyvlsf");
    			add_location(article0, file$9, 318, 2, 8313);
    			attr_dev(button0, "class", button0_class_value = "" + null_to_empty(ctx.selectedTheme.button) + " svelte-qyvlsf");
    			add_location(button0, file$9, 327, 3, 8568);
    			if (ctx.selectedTheme === void 0) add_render_callback(() => ctx.select_change_handler.call(select));
    			add_location(select, file$9, 328, 3, 8659);
    			add_location(button1, file$9, 334, 3, 8855);
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$9, 336, 4, 8935);
    			add_location(label, file$9, 335, 3, 8914);
    			attr_dev(article1, "class", article1_class_value = "" + null_to_empty(ctx.selectedTheme.hero2) + " svelte-qyvlsf");
    			add_location(article1, file$9, 322, 2, 8413);

    			dispose = [
    				listen_dev(button0, "click", ctx.layoutMenuOpen),
    				listen_dev(select, "change", ctx.select_change_handler),
    				listen_dev(button1, "click", ctx.getRealDataWay1),
    				listen_dev(input, "change", ctx.input_change_handler)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, article0, anchor);
    			mount_component(userhero1, article0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, article1, anchor);
    			mount_component(userhero2, article1, null);
    			append_dev(article1, t1);
    			append_dev(article1, button0);
    			append_dev(button0, t2);
    			append_dev(article1, t3);
    			append_dev(article1, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, ctx.selectedTheme);

    			append_dev(article1, t4);

    			if (switch_instance) {
    				mount_component(switch_instance, article1, null);
    			}

    			append_dev(article1, t5);
    			append_dev(article1, button1);
    			append_dev(article1, t7);
    			append_dev(article1, label);
    			append_dev(label, t8);
    			append_dev(label, input);

    			input.checked = ctx.getLucky;

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var userhero1_changes = {};
    			if (changed.selectedUser) userhero1_changes.avatarUrl = ctx.user.avatarUrl;
    			userhero1.$set(userhero1_changes);

    			if ((!current || changed.selectedTheme) && article0_class_value !== (article0_class_value = "" + null_to_empty(ctx.selectedTheme.hero1) + " svelte-qyvlsf")) {
    				attr_dev(article0, "class", article0_class_value);
    			}

    			var userhero2_changes = {};
    			if (changed.selectedUser) userhero2_changes.firstName = ctx.user.firstName;
    			if (changed.selectedUser) userhero2_changes.lastName = ctx.user.lastName;
    			if (changed.selectedUser) userhero2_changes.headline = ctx.user.headline;
    			userhero2.$set(userhero2_changes);

    			if ((!current || changed.selectedTheme) && button0_class_value !== (button0_class_value = "" + null_to_empty(ctx.selectedTheme.button) + " svelte-qyvlsf")) {
    				attr_dev(button0, "class", button0_class_value);
    			}

    			if (changed.themes) {
    				each_value_2 = ctx.themes;

    				let i;
    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value_2.length;
    			}

    			if (changed.selectedTheme) select_option(select, ctx.selectedTheme);

    			if (switch_value !== (switch_value = ctx.selectedTheme.component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;
    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});
    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());

    					switch_instance.$$.fragment.c();
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, article1, t5);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if (changed.getLucky) input.checked = ctx.getLucky;

    			if ((!current || changed.selectedTheme) && article1_class_value !== (article1_class_value = "" + null_to_empty(ctx.selectedTheme.hero2) + " svelte-qyvlsf")) {
    				attr_dev(article1, "class", article1_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(userhero1.$$.fragment, local);

    			transition_in(userhero2.$$.fragment, local);

    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(userhero1.$$.fragment, local);
    			transition_out(userhero2.$$.fragment, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(article0);
    			}

    			destroy_component(userhero1);

    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(article1);
    			}

    			destroy_component(userhero2);

    			destroy_each(each_blocks, detaching);

    			if (switch_instance) destroy_component(switch_instance);
    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block_1.name, type: "each", source: "(318:1) {#each selectedUser as user}", ctx });
    	return block;
    }

    // (348:3) {#each selectedJobs as job}
    function create_each_block$1(ctx) {
    	var current;

    	var userjob = new UserJob({
    		props: {
    		jobCompany: ctx.job.jobCompany,
    		jobTitle: ctx.job.jobTitle,
    		jobImage: ctx.job.jobImage,
    		jobDesc: ctx.job.jobDesc,
    		jobTime: ctx.job.jobTime
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			userjob.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(userjob, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var userjob_changes = {};
    			if (changed.selectedJobs) userjob_changes.jobCompany = ctx.job.jobCompany;
    			if (changed.selectedJobs) userjob_changes.jobTitle = ctx.job.jobTitle;
    			if (changed.selectedJobs) userjob_changes.jobImage = ctx.job.jobImage;
    			if (changed.selectedJobs) userjob_changes.jobDesc = ctx.job.jobDesc;
    			if (changed.selectedJobs) userjob_changes.jobTime = ctx.job.jobTime;
    			userjob.$set(userjob_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(userjob.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(userjob.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(userjob, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$1.name, type: "each", source: "(348:3) {#each selectedJobs as job}", ctx });
    	return block;
    }

    // (311:0) <WrapperGrid customAreas={selectedLayout} >
    function create_default_slot(ctx) {
    	var t0, t1, main, article0, h30, t3, article0_class_value, t4, article1, h31, t6, section0, img0, t7, div0, h40, t9, p0, t11, div1, p1, t13, section1, img1, t14, div2, h41, t16, p2, t18, div3, p3, t20, section2, img2, t21, div4, h42, t23, p4, t25, div5, p5, t27, section3, img3, t28, div6, h43, t30, p6, t32, div7, p7, t34, section4, img4, t35, div8, h44, t37, p8, t39, div9, p9, t41, section5, img5, t42, div10, h45, t44, p10, t46, div11, p11, t48, aside, h32, t50, img6, t51, img7, article1_class_value, t52, footer, nav, raw_value = ctx.selectedTheme.footerContent + "", footer_class_value, current;

    	let each_value_3 = ctx.datas;

    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_2[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_1 = ctx.selectedUser;

    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = ctx.selectedJobs;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t0 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t1 = space();
    			main = element("main");
    			article0 = element("article");
    			h30 = element("h3");
    			h30.textContent = "JOBS";
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			article1 = element("article");
    			h31 = element("h3");
    			h31.textContent = "SKILLS";
    			t6 = space();
    			section0 = element("section");
    			img0 = element("img");
    			t7 = space();
    			div0 = element("div");
    			h40 = element("h4");
    			h40.textContent = "skill title";
    			t9 = space();
    			p0 = element("p");
    			p0.textContent = "description";
    			t11 = space();
    			div1 = element("div");
    			p1 = element("p");
    			p1.textContent = "High";
    			t13 = space();
    			section1 = element("section");
    			img1 = element("img");
    			t14 = space();
    			div2 = element("div");
    			h41 = element("h4");
    			h41.textContent = "skill title";
    			t16 = space();
    			p2 = element("p");
    			p2.textContent = "description";
    			t18 = space();
    			div3 = element("div");
    			p3 = element("p");
    			p3.textContent = "High";
    			t20 = space();
    			section2 = element("section");
    			img2 = element("img");
    			t21 = space();
    			div4 = element("div");
    			h42 = element("h4");
    			h42.textContent = "skill title";
    			t23 = space();
    			p4 = element("p");
    			p4.textContent = "description";
    			t25 = space();
    			div5 = element("div");
    			p5 = element("p");
    			p5.textContent = "High";
    			t27 = space();
    			section3 = element("section");
    			img3 = element("img");
    			t28 = space();
    			div6 = element("div");
    			h43 = element("h4");
    			h43.textContent = "skill title";
    			t30 = space();
    			p6 = element("p");
    			p6.textContent = "description";
    			t32 = space();
    			div7 = element("div");
    			p7 = element("p");
    			p7.textContent = "High";
    			t34 = space();
    			section4 = element("section");
    			img4 = element("img");
    			t35 = space();
    			div8 = element("div");
    			h44 = element("h4");
    			h44.textContent = "skill title";
    			t37 = space();
    			p8 = element("p");
    			p8.textContent = "description";
    			t39 = space();
    			div9 = element("div");
    			p9 = element("p");
    			p9.textContent = "High";
    			t41 = space();
    			section5 = element("section");
    			img5 = element("img");
    			t42 = space();
    			div10 = element("div");
    			h45 = element("h4");
    			h45.textContent = "skill title";
    			t44 = space();
    			p10 = element("p");
    			p10.textContent = "description";
    			t46 = space();
    			div11 = element("div");
    			p11 = element("p");
    			p11.textContent = "High";
    			t48 = space();
    			aside = element("aside");
    			h32 = element("h3");
    			h32.textContent = "extra";
    			t50 = space();
    			img6 = element("img");
    			t51 = space();
    			img7 = element("img");
    			t52 = space();
    			footer = element("footer");
    			nav = element("nav");
    			add_location(h30, file$9, 345, 3, 9079);
    			attr_dev(article0, "class", article0_class_value = "" + null_to_empty(ctx.selectedTheme.section1) + " svelte-qyvlsf");
    			add_location(article0, file$9, 344, 2, 9033);
    			add_location(h31, file$9, 358, 3, 9369);
    			attr_dev(img0, "src", "https://via.placeholder.com/96");
    			attr_dev(img0, "alt", "#");
    			attr_dev(img0, "class", "svelte-qyvlsf");
    			add_location(img0, file$9, 360, 4, 9416);
    			add_location(h40, file$9, 362, 4, 9503);
    			add_location(p0, file$9, 363, 4, 9528);
    			attr_dev(div0, "class", "skill-desc svelte-qyvlsf");
    			add_location(div0, file$9, 361, 4, 9474);
    			add_location(p1, file$9, 366, 4, 9592);
    			attr_dev(div1, "class", "skill-level svelte-qyvlsf");
    			add_location(div1, file$9, 365, 4, 9562);
    			attr_dev(section0, "class", "skill svelte-qyvlsf");
    			add_location(section0, file$9, 359, 3, 9388);
    			attr_dev(img1, "src", "https://via.placeholder.com/96");
    			attr_dev(img1, "alt", "#");
    			attr_dev(img1, "class", "svelte-qyvlsf");
    			add_location(img1, file$9, 370, 4, 9660);
    			add_location(h41, file$9, 372, 4, 9747);
    			add_location(p2, file$9, 373, 4, 9772);
    			attr_dev(div2, "class", "skill-desc svelte-qyvlsf");
    			add_location(div2, file$9, 371, 4, 9718);
    			add_location(p3, file$9, 376, 4, 9836);
    			attr_dev(div3, "class", "skill-level svelte-qyvlsf");
    			add_location(div3, file$9, 375, 4, 9806);
    			attr_dev(section1, "class", "skill svelte-qyvlsf");
    			add_location(section1, file$9, 369, 3, 9632);
    			attr_dev(img2, "src", "https://via.placeholder.com/96");
    			attr_dev(img2, "alt", "#");
    			attr_dev(img2, "class", "svelte-qyvlsf");
    			add_location(img2, file$9, 380, 4, 9904);
    			add_location(h42, file$9, 382, 4, 9991);
    			add_location(p4, file$9, 383, 4, 10016);
    			attr_dev(div4, "class", "skill-desc svelte-qyvlsf");
    			add_location(div4, file$9, 381, 4, 9962);
    			add_location(p5, file$9, 386, 4, 10080);
    			attr_dev(div5, "class", "skill-level svelte-qyvlsf");
    			add_location(div5, file$9, 385, 4, 10050);
    			attr_dev(section2, "class", "skill svelte-qyvlsf");
    			add_location(section2, file$9, 379, 3, 9876);
    			attr_dev(img3, "src", "https://via.placeholder.com/96");
    			attr_dev(img3, "alt", "#");
    			attr_dev(img3, "class", "svelte-qyvlsf");
    			add_location(img3, file$9, 390, 4, 10148);
    			add_location(h43, file$9, 392, 4, 10235);
    			add_location(p6, file$9, 393, 4, 10260);
    			attr_dev(div6, "class", "skill-desc svelte-qyvlsf");
    			add_location(div6, file$9, 391, 4, 10206);
    			add_location(p7, file$9, 396, 4, 10324);
    			attr_dev(div7, "class", "skill-level svelte-qyvlsf");
    			add_location(div7, file$9, 395, 4, 10294);
    			attr_dev(section3, "class", "skill svelte-qyvlsf");
    			add_location(section3, file$9, 389, 3, 10120);
    			attr_dev(img4, "src", "https://via.placeholder.com/96");
    			attr_dev(img4, "alt", "#");
    			attr_dev(img4, "class", "svelte-qyvlsf");
    			add_location(img4, file$9, 400, 4, 10392);
    			add_location(h44, file$9, 402, 4, 10479);
    			add_location(p8, file$9, 403, 4, 10504);
    			attr_dev(div8, "class", "skill-desc svelte-qyvlsf");
    			add_location(div8, file$9, 401, 4, 10450);
    			add_location(p9, file$9, 406, 4, 10568);
    			attr_dev(div9, "class", "skill-level svelte-qyvlsf");
    			add_location(div9, file$9, 405, 4, 10538);
    			attr_dev(section4, "class", "skill svelte-qyvlsf");
    			add_location(section4, file$9, 399, 3, 10364);
    			attr_dev(img5, "src", "https://via.placeholder.com/96");
    			attr_dev(img5, "alt", "#");
    			attr_dev(img5, "class", "svelte-qyvlsf");
    			add_location(img5, file$9, 410, 4, 10636);
    			add_location(h45, file$9, 412, 4, 10723);
    			add_location(p10, file$9, 413, 4, 10748);
    			attr_dev(div10, "class", "skill-desc svelte-qyvlsf");
    			add_location(div10, file$9, 411, 4, 10694);
    			add_location(p11, file$9, 416, 4, 10812);
    			attr_dev(div11, "class", "skill-level svelte-qyvlsf");
    			add_location(div11, file$9, 415, 4, 10782);
    			attr_dev(section5, "class", "skill svelte-qyvlsf");
    			add_location(section5, file$9, 409, 3, 10608);
    			add_location(h32, file$9, 422, 4, 10893);
    			attr_dev(img6, "src", "https://via.placeholder.com/60");
    			attr_dev(img6, "alt", "#");
    			attr_dev(img6, "class", "svelte-qyvlsf");
    			add_location(img6, file$9, 423, 4, 10912);
    			attr_dev(img7, "src", "https://via.placeholder.com/60");
    			attr_dev(img7, "alt", "#");
    			attr_dev(img7, "class", "svelte-qyvlsf");
    			add_location(img7, file$9, 424, 4, 10970);
    			attr_dev(aside, "class", "extra-skills svelte-qyvlsf");
    			add_location(aside, file$9, 421, 3, 10860);
    			attr_dev(article1, "class", article1_class_value = "" + null_to_empty(ctx.selectedTheme.section2) + " svelte-qyvlsf");
    			add_location(article1, file$9, 357, 2, 9323);
    			attr_dev(main, "class", "svelte-qyvlsf");
    			add_location(main, file$9, 343, 1, 9024);
    			attr_dev(nav, "class", "socials");
    			add_location(nav, file$9, 433, 2, 11112);
    			attr_dev(footer, "class", footer_class_value = "" + null_to_empty(ctx.selectedTheme.footer) + " svelte-qyvlsf");
    			add_location(footer, file$9, 432, 1, 11070);
    		},

    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, article0);
    			append_dev(article0, h30);
    			append_dev(article0, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(article0, null);
    			}

    			append_dev(main, t4);
    			append_dev(main, article1);
    			append_dev(article1, h31);
    			append_dev(article1, t6);
    			append_dev(article1, section0);
    			append_dev(section0, img0);
    			append_dev(section0, t7);
    			append_dev(section0, div0);
    			append_dev(div0, h40);
    			append_dev(div0, t9);
    			append_dev(div0, p0);
    			append_dev(section0, t11);
    			append_dev(section0, div1);
    			append_dev(div1, p1);
    			append_dev(article1, t13);
    			append_dev(article1, section1);
    			append_dev(section1, img1);
    			append_dev(section1, t14);
    			append_dev(section1, div2);
    			append_dev(div2, h41);
    			append_dev(div2, t16);
    			append_dev(div2, p2);
    			append_dev(section1, t18);
    			append_dev(section1, div3);
    			append_dev(div3, p3);
    			append_dev(article1, t20);
    			append_dev(article1, section2);
    			append_dev(section2, img2);
    			append_dev(section2, t21);
    			append_dev(section2, div4);
    			append_dev(div4, h42);
    			append_dev(div4, t23);
    			append_dev(div4, p4);
    			append_dev(section2, t25);
    			append_dev(section2, div5);
    			append_dev(div5, p5);
    			append_dev(article1, t27);
    			append_dev(article1, section3);
    			append_dev(section3, img3);
    			append_dev(section3, t28);
    			append_dev(section3, div6);
    			append_dev(div6, h43);
    			append_dev(div6, t30);
    			append_dev(div6, p6);
    			append_dev(section3, t32);
    			append_dev(section3, div7);
    			append_dev(div7, p7);
    			append_dev(article1, t34);
    			append_dev(article1, section4);
    			append_dev(section4, img4);
    			append_dev(section4, t35);
    			append_dev(section4, div8);
    			append_dev(div8, h44);
    			append_dev(div8, t37);
    			append_dev(div8, p8);
    			append_dev(section4, t39);
    			append_dev(section4, div9);
    			append_dev(div9, p9);
    			append_dev(article1, t41);
    			append_dev(article1, section5);
    			append_dev(section5, img5);
    			append_dev(section5, t42);
    			append_dev(section5, div10);
    			append_dev(div10, h45);
    			append_dev(div10, t44);
    			append_dev(div10, p10);
    			append_dev(section5, t46);
    			append_dev(section5, div11);
    			append_dev(div11, p11);
    			append_dev(article1, t48);
    			append_dev(article1, aside);
    			append_dev(aside, h32);
    			append_dev(aside, t50);
    			append_dev(aside, img6);
    			append_dev(aside, t51);
    			append_dev(aside, img7);
    			insert_dev(target, t52, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, nav);
    			nav.innerHTML = raw_value;
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.datas) {
    				each_value_3 = ctx.datas;

    				let i;
    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(changed, child_ctx);
    					} else {
    						each_blocks_2[i] = create_each_block_3(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}
    				each_blocks_2.length = each_value_3.length;
    			}

    			if (changed.selectedTheme || changed.getLucky || changed.themes || changed.selectedUser) {
    				each_value_1 = ctx.selectedUser;

    				let i;
    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(changed, child_ctx);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(t1.parentNode, t1);
    					}
    				}

    				group_outros();
    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}

    			if (changed.selectedJobs) {
    				each_value = ctx.selectedJobs;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(article0, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}
    				check_outros();
    			}

    			if ((!current || changed.selectedTheme) && article0_class_value !== (article0_class_value = "" + null_to_empty(ctx.selectedTheme.section1) + " svelte-qyvlsf")) {
    				attr_dev(article0, "class", article0_class_value);
    			}

    			if ((!current || changed.selectedTheme) && article1_class_value !== (article1_class_value = "" + null_to_empty(ctx.selectedTheme.section2) + " svelte-qyvlsf")) {
    				attr_dev(article1, "class", article1_class_value);
    			}

    			if ((!current || changed.selectedTheme) && raw_value !== (raw_value = ctx.selectedTheme.footerContent + "")) {
    				nav.innerHTML = raw_value;
    			}

    			if ((!current || changed.selectedTheme) && footer_class_value !== (footer_class_value = "" + null_to_empty(ctx.selectedTheme.footer) + " svelte-qyvlsf")) {
    				attr_dev(footer, "class", footer_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_each(each_blocks_2, detaching);

    			if (detaching) {
    				detach_dev(t0);
    			}

    			destroy_each(each_blocks_1, detaching);

    			if (detaching) {
    				detach_dev(t1);
    				detach_dev(main);
    			}

    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach_dev(t52);
    				detach_dev(footer);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot.name, type: "slot", source: "(311:0) <WrapperGrid customAreas={selectedLayout} >", ctx });
    	return block;
    }

    function create_fragment$9(ctx) {
    	var t, current_block_type_index, if_block1, if_block1_anchor, current;

    	var if_block0 = (ctx.layoutMenuVisible) && create_if_block_1(ctx);

    	var if_block_creators = [
    		create_if_block$1,
    		create_else_block
    	];

    	var if_blocks = [];

    	function select_block_type(changed, ctx) {
    		if (ctx.getLucky) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(null, ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.layoutMenuVisible) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();
    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});
    				check_outros();
    			}

    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(changed, ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});
    				check_outros();

    				if_block1 = if_blocks[current_block_type_index];
    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}
    				transition_in(if_block1, 1);
    				if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);

    			if (detaching) {
    				detach_dev(t);
    			}

    			if_blocks[current_block_type_index].d(detaching);

    			if (detaching) {
    				detach_dev(if_block1_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$9.name, type: "component", source: "", ctx });
    	return block;
    }

    let visible = true;

    const endpoint = "http://localhost:3000/api/v1";

    let uri = "/users/1";

    function instance$6($$self, $$props, $$invalidate) {
    	

    	const themes = [
    			{ name: 'theme wireframe', bg: "", hero1:"hero-logo", hero2: "hero-title", button: 'wireframe-btn', section1: "jobs", section2: "skills", footer: 'footer', footerContent: "<img src='https://via.placeholder.com/32' alt ='#' /><img src='https://via.placeholder.com/32' alt ='#' /><img src='https://via.placeholder.com/32' alt ='#' />", component: WireframeTheme },
    			{ name: 'theme nes', bg: "",hero1: "nes-container is-rounded is-centered hero-logo", hero2: "nes-container is-rounded hero-title", button: 'nes-btn', section1: "nes-container is-rounded", section2: "nes-container is-rounded", footer: 'nes-container is-rounded', footerContent: "<i class='nes-icon linkedin is-large'></i><i class='nes-icon gmail is-large'></i><i class='nes-icon github is-large'></i><i class='nes-icon twitter is-large'></i>", component: NesTheme   },
    			{ name: 'theme nes dark',bg: "", hero1: "nes-container is-dark is-rounded is-centered hero-logo", hero2: "nes-container is-dark is-rounded hero-title", button: 'nes-btn is-primary', section1: "nes-container is-dark is-rounded", section2: "nes-container is-dark is-rounded", footer: 'nes-container is-dark is-rounded', footerContent: "<i class='nes-icon linkedin is-large'></i><i class='nes-icon gmail is-large'></i><i class='nes-icon github is-large'></i><i class='nes-icon twitter is-large'></i>", component: NesTheme   },
    			{ name: 'theme culrs',bg: "ouf", hero1: "hero-logo culrs-logo", hero2: "hero-title culrs-title", button:"culrs-btn",section1: "jobs jobs-culrs",section2:"skills skills-culrs",footer:"footer footer-culrs",footerContent:"", component: CulrsTheme },
    	];
     	let selectedTheme = themes[0];

    	const layouts = ["\
			'. . hero-logo hero-title hero-title . .' \
			'. . main main main . .' \
			'. . footer footer footer . .'",
    				"\
			'. . hero-title hero-title hero-logo . .' \
			'. . main main main . .' \
			'. . footer footer footer . .'",
    			"\
			'. . hero-logo hero-title hero-title . .' \
			'. . footer footer footer . .' \
			'. . main main main . .'",
    			"\
			'. . hero-title hero-title hero-logo . .' \
			'. . footer footer footer . .' \
			'. . main main main . .'",
    			"\
			'. . footer footer footer . .' \
			'. . hero-logo hero-title hero-title . .' \
			'. . main main main . .'",
    			"\
			'. . footer footer footer . .' \
			'. . hero-title hero-title hero-logo . .' \
			'. . main main main . .'",
    			"\
			'. . main main main . .' \
			'. . hero-title hero-title hero-logo . .' \
			'. . footer footer footer . .'",
    			"\
			'. . main main main . .' \
			'. . hero-logo hero-title hero-title . .' \
			'. . footer footer footer . .'",
    			"\
			'. . main main main . .' \
			'. . footer footer footer . .' \
			'. . hero-logo hero-title hero-title . .'",
    			"\
			'. . main main main . .' \
			'. . footer footer footer . .' \
			'. . hero-title hero-title hero-logo . .'"];

    	let selectedLayout = layouts[0];

    	

    	let layoutMenuVisible = false;

    	function layoutMenuOpen() {
    		$$invalidate('layoutMenuVisible', layoutMenuVisible = true);
    	}	function layoutMenuClose() {
    		$$invalidate('layoutMenuVisible', layoutMenuVisible = false);
    	}	 let headers = new Headers({
        "Accept"       : "application/vnd.api+json",
        "User-Agent"   : "OhOhOh"
    });

    	let datas = [];

    	 onMount(async () => {
    		const response = await fetch(endpoint + uri, {
    			method: 'GET',
    			headers: headers
    		});
    		const json = await response.json();
    		$$invalidate('datas', datas = [...datas,json.data.attributes]);
    	});


    	const users = [
    		{
    			id: 1,
    			firstName: 'first name',
    			lastName: 'last name',
    			headline: 'job headline',
    			avatarUrl: 'https://via.placeholder.com/200'
    		},
    		{
    			id: 2,
    			firstName: 'arnaud',
    			lastName: 'cormier',
    			headline: 'Freelance',
    			avatarUrl: '/images/avatar.jpg'

    		}
    	];

    	const jobs = [
    		{
    			id: 1,
    			jobCompany: 'company',
    			jobTitle: 'job title',
    			jobDesc: 'job description',
    			jobTime: '2y',
    			jobImage: 'https://via.placeholder.com/96',
    			userId: 1
    		},
    		{
    			id: 2,
    			jobCompany: 'company',
    			jobTitle: 'job title',
    			jobDesc: 'job description',
    			jobTime: '2y',
    			jobImage: 'https://via.placeholder.com/96',
    			userId: 1
    		},
    		{
    			id: 3,
    			jobCompany: 'upyourbizz',
    			jobTitle: 'administrateur systèmes et réseaux',
    			jobDesc: 'sécurisation et mise en place infrastructure serveurs web linux',
    			jobTime: '2y',
    			jobImage: '/images/uyb.png',
    			userId: 2
    		},
    		{
    			id: 4,
    			jobCompany: 'geodis',
    			jobTitle: 'technicien informatique support et déploiement',
    			jobDesc: 'Support informatique région ouest',
    			jobTime: '2y',
    			jobImage: '/images/geodis.png',
    			userId: 2
    		},
    		{
    			id: 5,
    			jobCompany: 'mma',
    			jobTitle: 'technicien de supervision systèmes et réseaux',
    			jobDesc: 'Gestion des incidents, mise en prod et monitoring',
    			jobTime: '4y',
    			jobImage: '/images/mma.png',
    			userId: 2
    		},

    	];
    	let seedId = 1;
    	function getRealDataWay1() {
    		seedId =2;
    		$$invalidate('selectedUser', selectedUser = users.filter(user => user.id == seedId));
    		$$invalidate('selectedJobs', selectedJobs = jobs.filter(jobs => jobs.userId == seedId));
    	}
    	let selectedUser = users.filter(user => user.id == seedId);
    	let selectedJobs = jobs.filter(jobs => jobs.userId == seedId);

    	let getLucky = false;

    	const click_handler = ({ l }) => $$invalidate('selectedLayout', selectedLayout = l);

    	function select_change_handler() {
    		selectedTheme = select_value(this);
    		$$invalidate('selectedTheme', selectedTheme);
    		$$invalidate('themes', themes);
    	}

    	function input_change_handler() {
    		getLucky = this.checked;
    		$$invalidate('getLucky', getLucky);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('selectedTheme' in $$props) $$invalidate('selectedTheme', selectedTheme = $$props.selectedTheme);
    		if ('selectedLayout' in $$props) $$invalidate('selectedLayout', selectedLayout = $$props.selectedLayout);
    		if ('layoutMenuVisible' in $$props) $$invalidate('layoutMenuVisible', layoutMenuVisible = $$props.layoutMenuVisible);
    		if ('visible' in $$props) visible = $$props.visible;
    		if ('uri' in $$props) uri = $$props.uri;
    		if ('headers' in $$props) headers = $$props.headers;
    		if ('datas' in $$props) $$invalidate('datas', datas = $$props.datas);
    		if ('seedId' in $$props) seedId = $$props.seedId;
    		if ('selectedUser' in $$props) $$invalidate('selectedUser', selectedUser = $$props.selectedUser);
    		if ('selectedJobs' in $$props) $$invalidate('selectedJobs', selectedJobs = $$props.selectedJobs);
    		if ('getLucky' in $$props) $$invalidate('getLucky', getLucky = $$props.getLucky);
    	};

    	$$self.$$.update = ($$dirty = { getLucky: 1 }) => {
    		if ($$dirty.getLucky) { console.log(getLucky); }
    	};

    	return {
    		themes,
    		selectedTheme,
    		layouts,
    		selectedLayout,
    		layoutMenuVisible,
    		layoutMenuOpen,
    		layoutMenuClose,
    		datas,
    		getRealDataWay1,
    		selectedUser,
    		selectedJobs,
    		getLucky,
    		click_handler,
    		select_change_handler,
    		input_change_handler
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$9, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment$9.name });
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
