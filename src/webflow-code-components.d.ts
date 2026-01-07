declare module '@webflow/code-components' {
    import { ComponentType } from 'react';

    interface PropConfig {
        type: 'string' | 'number' | 'boolean' | 'color' | 'image' | 'file' | 'date' | 'select' | 'json';
        defaultValue?: any;
        options?: any[];
        [key: string]: any;
    }

    interface ComponentConfig {
        name?: string;
        icon?: string;
        description?: string;
        props?: Record<string, PropConfig>;
        [key: string]: any;
    }

    export function component<P = {}>(
        component: ComponentType<P>,
        config?: ComponentConfig
    ): any;
}
