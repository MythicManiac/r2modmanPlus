<template>
    <div>
        <DownloadModModal
            :show-download-modal="modToDownload !== null"
            :thunderstore-mod="modToDownload"
            :update-all-mods="false"
            @closed-modal="modToDownload = null;"
            @error="emitError($event)"
        />

        <ExpandableCard
            v-for='(key, index) in pagedModList' :key="`online-${key.getFullName()}-${index}-${settings.getContext().global.expandedCards}`"
            :image="key.getVersions()[0].getIcon()"
            :id="index"
            :description="key.getVersions()[0].getDescription()"
            :funkyMode="funkyMode"
            :darkTheme="darkTheme"
            :expandedByDefault="cardExpanded">
            <template v-slot:title>
                <span v-if="key.isPinned()" class='has-tooltip-left'
                      data-tooltip='Pinned on Thunderstore'>
                    <span class="tag is-info margin-right margin-right--half-width">Pinned</span>
                    <span class="selectable">{{key.getName()}} <span class="card-byline">by {{key.getOwner()}}</span></span>
                </span>
                <span v-else-if="isModDeprecated(key)" class='has-tooltip-left'
                      data-tooltip='This mod is potentially broken'>
                    <span class="tag is-danger margin-right margin-right--half-width">Deprecated</span>
                    <strike class="selectable">{{key.getName()}} <span class="card-byline">by {{key.getOwner()}}</span></strike>
                </span>
                <span v-else class='selectable'>
                    {{key.getName()}} <span class="card-byline">by {{key.getOwner()}}</span>
                </span>
            </template>
            <template v-slot:other-icons>
                <span class='card-header-icon has-tooltip-left'
                      data-tooltip='Mod already installed'
                      v-if="isThunderstoreModInstalled(key)">
                    <i class='fas fa-check'></i>
                </span>
            </template>
            <template v-slot:description>
                <p class='card-timestamp'><strong>Last updated:</strong> {{getReadableDate(key.getDateUpdated())}}</p>
                <p class='card-timestamp'><strong>Categories:</strong> {{getReadableCategories(key)}}</p>
            </template>
            <a class='card-footer-item' @click='showDownloadModal(key)'>Download</a>
            <Link :url="key.getPackageUrl()" :target="'external'" class='card-footer-item'>
                View on Website
            </Link>
            <div class='card-footer-item non-selectable'>
                <span><i class='fas fa-download'/> {{key.getTotalDownloads()}}</span>
            </div>
            <div class='card-footer-item non-selectable'>
                <span><i class='fas fa-thumbs-up'/> {{key.getRating()}}</span>
            </div>
        </ExpandableCard>

    </div>
</template>

<script lang="ts">

import { Prop, Vue } from 'vue-property-decorator';
import Component from 'vue-class-component';
import ThunderstoreMod from '../../model/ThunderstoreMod';
import ManagerSettings from '../../r2mm/manager/ManagerSettings';
import { ExpandableCard, Link } from '../all';
import DownloadModModal from './DownloadModModal.vue';
import ManifestV2 from '../../model/ManifestV2';
import R2Error from '../../model/errors/R2Error';
import Timeout = NodeJS.Timeout;

@Component({
        components: {
            DownloadModModal,
            ExpandableCard,
            Link
        }
    })
    export default class OnlineModList extends Vue {

        @Prop()
        pagedModList!: ThunderstoreMod[];

        @Prop({required: true})
        private settings!: ManagerSettings;

        private cardExpanded: boolean = false;
        private darkTheme: boolean = false;
        private funkyMode: boolean = false;

        private settingsUpdateTimer: Timeout | null = null;

        private updatedSettings() {
            this.cardExpanded = this.settings.getContext().global.expandedCards;
            this.darkTheme = this.settings.getContext().global.darkTheme;
            this.funkyMode = this.settings.getContext().global.funkyModeEnabled;
        }

        get thunderstorePackages(): ThunderstoreMod[] {
            return this.$store.state.thunderstoreModList;
        }

        private modToDownload: ThunderstoreMod | null = null;

        get localModList(): ManifestV2[] {
            return this.$store.state.localModList;
        }

        isModDeprecated(key: any) {
            if (key.deprecated) {
                return true;
            } else {
                const mod: ThunderstoreMod = new ThunderstoreMod().fromReactive(key);
                if (this.isModDependencyDeprecated(mod)) {
                    return true;
                }
            }
            return false;
        }

        isModDependencyDeprecated(mod: ThunderstoreMod): boolean {
            let shouldStrikethrough = false;
            this.thunderstorePackages.forEach((tsMod: ThunderstoreMod) => {
                if (!shouldStrikethrough) {
                    mod.getDependencies().forEach((dependency: string) => {
                        if (dependency.startsWith(tsMod.getFullName())) {
                            if (tsMod.isDeprecated()) {
                                shouldStrikethrough = true;
                                return;
                            } else {
                                shouldStrikethrough = this.isModDependencyDeprecated(tsMod);
                            }
                        }
                    });
                }
            });
            return shouldStrikethrough;
        }

        isThunderstoreModInstalled(vueMod: any) {
            const mod: ThunderstoreMod = new ThunderstoreMod().fromReactive(vueMod);
            return this.localModList.find((local: ManifestV2) => local.getName() === mod.getFullName()) != undefined;
        }

        showDownloadModal(mod: any) {
            this.modToDownload = new ThunderstoreMod().fromReactive(mod);
        }

        getReadableDate(date: Date): string {
            const dateObject: Date = new Date(date);
            return `${dateObject.toDateString()}, ${dateObject.toLocaleTimeString()}`
        }

        getReadableCategories(tsMod: ThunderstoreMod) {
            const mod = new ThunderstoreMod().fromReactive(tsMod);
            return mod.getCategories().join(", ");
        }

        emitError(error: R2Error) {
            this.$emit('error', error);
        }

        created() {
            if (this.settingsUpdateTimer !== null) {
                clearInterval(this.settingsUpdateTimer);
            }
            this.settingsUpdateTimer = setInterval(async () => {
                this.updatedSettings();
            }, 100);
        }

        destroyed() {
            if (this.settingsUpdateTimer !== null) {
                clearInterval(this.settingsUpdateTimer);
                this.settingsUpdateTimer = null;
            }
        }

    }

</script>
