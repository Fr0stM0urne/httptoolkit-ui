import * as React from 'react';
import { autorun } from 'mobx';
import { disposeOnUnmount, observer } from 'mobx-react';

import {
    Menu,
    Submenu,
    Separator,
    Item,
    contextMenu
} from 'react-contexify';

import { ContextMenuItem, ContextMenuState } from '../model/ui/context-menu';
import { UnreachableCheck } from '../util/error';

@observer
export class HtmlContextMenu<T> extends React.Component<{
    menuState: ContextMenuState<T>,
    onHidden: () => void
}> {

    componentDidMount() {
        // Automatically show the menu when this is rendered:
        disposeOnUnmount(this, autorun(() => {
            const menuState = this.props.menuState;

            // Annoyingly, the menu is not listening immediately after the component
            // is mounted, so we have to delay this slightly:
            setTimeout(() => {
                contextMenu.show({
                    id: 'menu',
                    event: menuState.event
                });
            }, 10);
        }));
    }

    render() {
        return <Menu
            id='menu'
            onVisibilityChange={this.onVisibilityChange}
        >
            { this.props.menuState.items.map(this.renderItem) }
        </Menu>
    }

    renderItem = (item: ContextMenuItem<T>, i: number) => {
        if (item.type === 'separator') {
            return <Separator key={i} />;
        } else if (item.type === 'option') {
            return <Item
                key={i}
                onClick={() => item.callback(this.props.menuState.data)}
                disabled={item.enabled === false}
            >
                { item.label }
            </Item>
        } else if (item.type === 'submenu') {
            return <Submenu
                key={i}
                label={item.label}
                disabled={item.enabled === false}
            >
                { item.items.map(this.renderItem) }
            </Submenu>
        } else throw new UnreachableCheck(item, i => i.type);
    }

    onVisibilityChange = (visible: boolean) => {
        if (!visible) this.props.onHidden();
    };

}