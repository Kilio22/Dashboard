'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Dashboard</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-d80e25b6e6273e997d15f94a7f96b048"' : 'data-target="#xs-components-links-module-AppModule-d80e25b6e6273e997d15f94a7f96b048"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-d80e25b6e6273e997d15f94a7f96b048"' :
                                            'id="xs-components-links-module-AppModule-d80e25b6e6273e997d15f94a7f96b048"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link">AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AuthModule-12fea66616ba466a2b4149380a787828"' : 'data-target="#xs-components-links-module-AuthModule-12fea66616ba466a2b4149380a787828"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AuthModule-12fea66616ba466a2b4149380a787828"' :
                                            'id="xs-components-links-module-AuthModule-12fea66616ba466a2b4149380a787828"' }>
                                            <li class="link">
                                                <a href="components/LoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OfficeOAuthCallbackComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OfficeOAuthCallbackComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OfficeOAuthComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OfficeOAuthComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegisterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerifyAuthComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VerifyAuthComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/GridModule.html" data-type="entity-link">GridModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-GridModule-eeb367ffcfc4a2f11e8c404c0ab681ba"' : 'data-target="#xs-components-links-module-GridModule-eeb367ffcfc4a2f11e8c404c0ab681ba"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GridModule-eeb367ffcfc4a2f11e8c404c0ab681ba"' :
                                            'id="xs-components-links-module-GridModule-eeb367ffcfc4a2f11e8c404c0ab681ba"' }>
                                            <li class="link">
                                                <a href="components/GridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GridComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridHeaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GridHeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MsCalendarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MsCalendarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MsMailComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MsMailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RdSubredditWatcherComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RdSubredditWatcherComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RefreshRateInputDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RefreshRateInputDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SpotifyArtistComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SpotifyArtistComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TtvStreamWatcherComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TtvStreamWatcherComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TtvUserWatcherComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TtvUserWatcherComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WeatherComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">WeatherComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/YtChannelWatcherComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">YtChannelWatcherComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/YtVideoWatcherComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">YtVideoWatcherComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-GridModule-eeb367ffcfc4a2f11e8c404c0ab681ba"' : 'data-target="#xs-directives-links-module-GridModule-eeb367ffcfc4a2f11e8c404c0ab681ba"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-GridModule-eeb367ffcfc4a2f11e8c404c0ab681ba"' :
                                        'id="xs-directives-links-module-GridModule-eeb367ffcfc4a2f11e8c404c0ab681ba"' }>
                                        <li class="link">
                                            <a href="directives/WidgetRenderDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">WidgetRenderDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomeModule.html" data-type="entity-link">HomeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HomeModule-f025ec17ede4769e5f0c2337d17c5eee"' : 'data-target="#xs-components-links-module-HomeModule-f025ec17ede4769e5f0c2337d17c5eee"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HomeModule-f025ec17ede4769e5f0c2337d17c5eee"' :
                                            'id="xs-components-links-module-HomeModule-f025ec17ede4769e5f0c2337d17c5eee"' }>
                                            <li class="link">
                                                <a href="components/FooterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomeComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/NotFoundModule.html" data-type="entity-link">NotFoundModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-NotFoundModule-66a7c8df0ca02cef1258fa3c73b54d2f"' : 'data-target="#xs-components-links-module-NotFoundModule-66a7c8df0ca02cef1258fa3c73b54d2f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-NotFoundModule-66a7c8df0ca02cef1258fa3c73b54d2f"' :
                                            'id="xs-components-links-module-NotFoundModule-66a7c8df0ca02cef1258fa3c73b54d2f"' }>
                                            <li class="link">
                                                <a href="components/NotFoundComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotFoundComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link">UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-UsersModule-b8fe7af94cd8e00234a930ac17403530"' : 'data-target="#xs-components-links-module-UsersModule-b8fe7af94cd8e00234a930ac17403530"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UsersModule-b8fe7af94cd8e00234a930ac17403530"' :
                                            'id="xs-components-links-module-UsersModule-b8fe7af94cd8e00234a930ac17403530"' }>
                                            <li class="link">
                                                <a href="components/UsersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UsersComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DashboardService.html" data-type="entity-link">DashboardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GridService.html" data-type="entity-link">GridService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthInterceptor.html" data-type="entity-link">AuthInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Authenticated.html" data-type="entity-link">Authenticated</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DashboardServiceProps.html" data-type="entity-link">DashboardServiceProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DashboardWidget.html" data-type="entity-link">DashboardWidget</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Id.html" data-type="entity-link">Id</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IResponse.html" data-type="entity-link">IResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MicrosoftCalendar.html" data-type="entity-link">MicrosoftCalendar</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MicrosoftCalendarEvent.html" data-type="entity-link">MicrosoftCalendarEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MicrosoftMail.html" data-type="entity-link">MicrosoftMail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MicrosoftMailbox.html" data-type="entity-link">MicrosoftMailbox</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OAuthLogin.html" data-type="entity-link">OAuthLogin</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SpotifyArtist.html" data-type="entity-link">SpotifyArtist</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Subreddit.html" data-type="entity-link">Subreddit</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubredditCreationFormatted.html" data-type="entity-link">SubredditCreationFormatted</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Thumbnail.html" data-type="entity-link">Thumbnail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TtvStream.html" data-type="entity-link">TtvStream</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TtvUser.html" data-type="entity-link">TtvUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link">User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Weather.html" data-type="entity-link">Weather</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WidgetConfig.html" data-type="entity-link">WidgetConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WidgetGridConfig.html" data-type="entity-link">WidgetGridConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WidgetProps.html" data-type="entity-link">WidgetProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WidgetQueryConfig.html" data-type="entity-link">WidgetQueryConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/YtChannel.html" data-type="entity-link">YtChannel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/YtChannelSwagStats.html" data-type="entity-link">YtChannelSwagStats</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/YtVideo.html" data-type="entity-link">YtVideo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/YtVideoSwagStats.html" data-type="entity-link">YtVideoSwagStats</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});