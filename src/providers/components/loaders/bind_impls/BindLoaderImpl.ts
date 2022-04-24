import SettingsViewProvider from '../SettingsViewProvider';
import LocalModListProvider from '../LocalModListProvider';
import OnlineModListProvider from '../OnlineModListProvider';
import NavigationMenuProvider from '../NavigationMenuProvider';

export default class BindLoaderImpl {

    static bind() {
        SettingsViewProvider.provide(() => import("../../../../components/settings-components/SettingsView.vue"));
        LocalModListProvider.provide(() => import("../../../../components/views/LocalModList.vue"));
        OnlineModListProvider.provide(() => import("../../../../components/views/OnlineModList.vue"));
        NavigationMenuProvider.provide(() => import("../../../../components/navigation/NavigationMenu.vue"));
    }

}
