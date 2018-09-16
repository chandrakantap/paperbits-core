declare var Vue;

export interface ComponentConfig {
    selector: string;
    template: string;
    injectable?: string;
}

export function Component(config: ComponentConfig): ClassDecorator {
    return function (target) {
        const props = Reflect.getMetadata("props", target);

        const vueComponentConfig = {
            template: config.template,
            props: props,
            data: () => Component.prototype.getInstance(target),
            methods: {},
            watch: {}
        };

        const propertyNames = Object.getOwnPropertyNames(target.prototype);

        propertyNames.forEach(name => {
            const method = target.prototype[name];

            if (typeof method !== "function" || name === "constructor") {
                return;
            }

            vueComponentConfig.methods[name] = method;

            const lifecycleHook = Reflect.getMetadata("lifecycle", method);

            if (lifecycleHook) {
                vueComponentConfig[lifecycleHook] = method;
            }

            const computed = Reflect.getMetadata("computed", method);

            if (computed) {
                vueComponentConfig[computed] = method;
            }

            const watchPropertyName = Reflect.getMetadata("watch", method);

            if (watchPropertyName) {
                vueComponentConfig.watch[watchPropertyName] = method;
            }
        });

        Vue.component(config.selector, vueComponentConfig);

        /* 
            Just in case:

            Vue.component(config.selector, function (resolve, reject) {
                setTimeout(function () {
                    resolve(vueComponentConfig)
                }, 1000)
            });
        */
    };
}

/**
 * https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks
 * @param hookName Name of the instance lifecycle hooks
 */
export function LifecylceHook(hookName: string) {
    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata("lifecycle", hookName, target[propertyKey]);
    };
}

export let OnBeforeCreate = () => LifecylceHook("beforeCreate");
export let OnCreated = () => LifecylceHook("created");
export let OnBeforeMount = () => LifecylceHook("beforeMount");
export let OnMounted = () => LifecylceHook("mounted");
export let OnBeforeDestroy = () => LifecylceHook("beforeDestroy");
export let OnDestroyed = () => LifecylceHook("destroyed");
export let OnBeforeUpdate = () => LifecylceHook("beforeUpdate");
export let OnUpdated = () => LifecylceHook("updated");
export let OnActivated = () => LifecylceHook("activated");
export let OnDeactivated = () => LifecylceHook("deactivated");
export let OnRender = () => LifecylceHook("render");
export let OnErrorCaptured = () => LifecylceHook("errorCaptured");

export function Computed(): MethodDecorator {
    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata("computed", name, target[propertyKey]);
    };
}

export function Watch(propertyName: string): MethodDecorator {
    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata("watch", propertyName, target[propertyKey]);
    };
}

export function Prop(): PropertyDecorator {
    return function (target: any, propertyKey: string) {
        let props: string[] = Reflect.getMetadata("props", target.constructor);

        if (!props) {
            props = [];
        }

        props.push(propertyKey);

        Reflect.defineMetadata("props", props, target.constructor);
    };
}

export function Emit(eventName: string): PropertyDecorator {
    return function (target: any, propertyKey: string) {
        target[propertyKey] = function (...args) { // Don't use arrow function here!
            this.$emit(eventName, ...args)
        };
    };
}

Component.prototype.getInstance = (constructor) => {
    return new constructor();
};