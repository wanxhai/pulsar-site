// @ts-check

const _ = require("lodash");
const linkifyRegex = require("./plugins/remark-linkify-regex");
const versions = require("./versions.json");
const versionsMap = {
    ..._.keyBy(
        versions.map((item) => {
            return {
                label: item,
                path: item,
            };
        }),
        "label"
    ),
    current: {
        label: "Next",
        path: "next",
    },
};

let buildVersions = ["current"];
try {
    buildVersions = require("./.build-versions.json");
} catch (error) {
    //do nothing
}

const oldUrl = "https://pulsar.apache.org";
const url = "https://pulsar.apache.org";
const javadocUrl = url + "/api";
const restApiUrl = url + "/admin-rest-api";
const functionsApiUrl = url + "/functions-rest-api";
const sourceApiUrl = url + "/source-rest-api";
const sinkApiUrl = url + "/sink-rest-api";
const packagesApiUrl = url + "/packages-rest-api";
const transactionsApiUrl = url + "/transactions-rest-api";
const lookupApiUrl = url + "/lookup-rest-api";
const githubUrl = "https://github.com/apache/pulsar";
const githubSiteUrl = "https://github.com/apache/pulsar-site";
const baseUrl = "/";
const math = require('remark-math');
const katex = require('rehype-katex');

const injectLinkParse = ([, prefix, , name, path]) => {
    if (prefix == "javadoc") {
        return {
            link: javadocUrl + path,
            text: name,
        };
    } else if (prefix == "github") {
        return {
            link: githubUrl + "/tree/master/" + path,
            text: name,
        };
    } else if (prefix == "rest") {
        return {
            link: restApiUrl + "#" + path,
            text: name,
        };
    } else if (prefix == "functions") {
        return {
            link: functionsApiUrl + "#" + path,
            text: name,
        };
    } else if (prefix == "source") {
        return {
            link: sourceApiUrl + "#" + path,
            text: name,
        };
    } else if (prefix == "sink") {
        return {
            link: sinkApiUrl + "#" + path,
            text: name,
        };
    } else if (prefix == "packages") {
        return {
            link: packagesApiUrl + "#" + path,
            text: name,
        };
    }

    return {
        link: path,
        text: name,
    };
};

const injectLinkParseForEndpoint = ([, info]) => {
    let [method, path, suffix] = info.split("|");
    if (!suffix) {
        suffix = path;
    }

    let restPath = path.split("/");
    const restApiVersion = restPath[2];
    const restApiType = restPath[3];
    let restBaseUrl = restApiUrl;
    if (restApiType == "functions") {
        restBaseUrl = functionsApiUrl;
    } else if (restApiType == "source") {
        restBaseUrl = sourceApiUrl;
    } else if (restApiType == "sink") {
        restBaseUrl = sinkApiUrl;
    } else if (restApiType == "packages") {
        restBaseUrl = packagesApiUrl;
    } else if (restApiType == "transactions") {
        restBaseUrl = transactionsApiUrl;
    } else if (restApiType == "lookup") {
        restBaseUrl = lookupApiUrl;
    }
    let restUrl = "";
    if (suffix.indexOf("?version=") >= 0) {
        const suffixAndVersion = suffix.split("?version=")
        restUrl = "version=" + suffixAndVersion[1] + "&apiversion=" + restApiVersion + "#" + suffixAndVersion[0];
    } else {
        restUrl = "version=master&apiversion=" + restApiVersion + "#" + suffix;
    }
    return {
        text: method + " " + path,
        link: restBaseUrl + "?" + restUrl,
    };
};

/** @type {import('@docusaurus/types').Config} */
module.exports = {
    title: "Apache Pulsar",
    tagline: "Apache Pulsar is a distributed, open source pub-sub messaging and streaming platform for real-time workloads, managing hundreds of billions of events per day.",
    url: "https://pulsar.apache.org",
    baseUrl: baseUrl,
    onBrokenLinks: "warn",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/favicon.ico",
    organizationName: "apache",
    projectName: "pulsar",
    customFields: {
        githubUrl,
        oldUrl,
    },
    trailingSlash: true,
    themeConfig: {
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        announcementBar: {
            id: "summit",
            content: `🚀 Pulsar Virtual Summit Europe 2023 will take place on Tuesday, May 23rd, 2023! <a target="_blank" href="https://events.zoom.us/ev/Ap6rsDg9LeVfmdajJ_eB13HH026J1d_o8OoTKkQnl_jzVl-srhwB~AggLXsr32QYFjq8BlYLZ5I06Dg">Register now for free</a>!`,
            backgroundColor: "#198fff",
            textColor: "#fff",
            isCloseable: true,
        },
        colorMode: {
            disableSwitch: false,
        },
        navbar: {
            title: "",
            logo: {
                alt: "pulsar logo",
                src: "img/logo.svg",
            },
            items: [
                {
                    type: "dropdown",
                    label: "Get Started",
                    position: "right",
                    items: [
                        {
                            type: 'doc',
                            docId: 'concepts-overview',
                            label: "Pulsar Concepts",
                        },
                        {
                            type: 'doc',
                            docId: 'about',
                            label: "Quickstart",
                        },
                        {
                            to: "/ecosystem/",
                            label: "Ecosystem",
                        },
                    ],
                },
                {
                    type: 'doc',
                    docId: 'about',
                    position: "right",
                    label: "Docs",
                },
                {
                    to: "/contribute/",
                    position: "right",
                    label: "Contribute",
                },
                {
                    type: "dropdown",
                    label: "Community",
                    position: "right",
                    className: "community-dropdown",
                    items: [
                        {
                            to: "/community#section-welcome",
                            label: "Welcome",
                            className: "scroll-link scroll-welcome",
                            id: "scroll-welcome",
                        },
                        {
                            to: "/community#section-discussions",
                            label: "Discussions",
                            className: "scroll-link scroll-discussions",
                            id: "scroll-discussions",
                        },
                        {
                            to: "/community#section-governance",
                            label: "Governance",
                            className: "scroll-link",
                            id: "scroll-governance",
                        },
                        {
                            to: "/community#section-community",
                            label: "Meet the Community",
                            className: "scroll-link",
                            id: "scroll-community",
                        },
                        {
                            to: "/community#section-contribute",
                            label: "Contribute",
                            className: "scroll-link",
                            id: "scroll-contribute",
                        },
                        {
                            to: "https://github.com/apache/pulsar/wiki",
                            label: "Wiki",
                        },
                        {
                            to: "https://github.com/apache/pulsar/issues",
                            label: "Issue Tracking",
                        },
                    ],
                },
                {
                    type: "dropdown",
                    label: "Learn",
                    position: "right",
                    items: [
                        {
                            to: "/blog",
                            label: "Blog",
                        },
                        {
                            to: "/case-studies",
                            label: "Case Studies",
                        },
                        {
                            to: "/resources",
                            label: "Resources",
                        },
                        {
                            to: "/events",
                            label: "Events",
                        },
                    ],
                },
                {
                    to: "/download",
                    label: "Download",
                    position: "right",
                    className: "download-btn pill-btn",
                },
                {
                    href: "https://github.com/apache/pulsar",
                    label: "Github",
                    position: "right",
                    className: "github-nav",
                },
            ],
        },
        footer: {
            logo: {alt: "Pulsar Logo", src: "img/pulsar-white.svg", href: "/"},
            links: [
                {
                    title: "Apache Foundation.",
                    items: [
                        {html: `<img class="footer-apache-logo" src="/img/Apache_Feather_Logo.svg" alt="" width="20">`},
                        {label: "Foundation", href: "https://www.apache.org/"},
                        {label: "Events", href: "https://www.apache.org/events/current-event.html"},
                        {label: "License", href: "https://www.apache.org/licenses/"},
                        {label: "Thanks", href: "https://www.apache.org/foundation/thanks"},
                        {label: "Security", href: "https://www.apache.org/security"},
                        {label: "Sponsorship", href: "https://www.apache.org/foundation/sponsorship"},
                        {label: "Privacy", href: "https://www.apache.org/foundation/policies/privacy.html"},
                    ],
                },
                {
                    items: [
                        {
                            html: `<div><small><strong>Apache Pulsar is available under the <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank">Apache License, version 2.0.</a></strong></small></div>
                            <div>Apache Pulsar is an open-source, distributed messaging and streaming platform built for the cloud.</div>`,
                        },
                    ],
                },
            ],
            copyright: `<p>Apache Pulsar is available under the Apache License, version 2.0.</p>
                        <p>Copyright © ${new Date().getFullYear()} The Apache Software Foundation. All Rights Reserved. Apache, Pulsar, Apache Pulsar, and the Apache feather logo are trademarks or registered trademarks of The Apache Software Foundation.</p>`,
        },
        prism: {
            theme: require("prism-react-renderer/themes/dracula"),
            additionalLanguages: [
                "csharp",
                "groovy",
                "http",
                "ini",
                "java",
                "powershell",
                "properties",
                "protobuf",
                "yaml",
            ],
        },
        algolia: {
            appId: "WK2YL0SALL",
            apiKey: "42d24d221fbd8eb59804a078208aaec0",
            indexName: "apache_pulsar",
        },
    },
    presets: [
        [
            "@docusaurus/preset-classic",
            /** @type {import('@docusaurus/preset-classic').Options} */
            {
                docs: {
                    path: "docs",
                    sidebarPath: require.resolve("./sidebars.js"),
                    editUrl: `${githubSiteUrl}/edit/main`,
                    remarkPlugins: [
                        linkifyRegex(
                            /{\@inject\:\s?(((?!endpoint)[^}])+):([^}]+):([^}]+)}/,
                            injectLinkParse
                        ),
                        linkifyRegex(
                            /{\@inject\:\s?endpoint\|([^}]+)}/,
                            injectLinkParseForEndpoint
                        ),
                        math,
                        ],
                    rehypePlugins: [katex],
                    versions: versionsMap,
                    onlyIncludeVersions: buildVersions || ["current"],
                },
                blog: {
                    showReadingTime: true,
                    editUrl: `${githubSiteUrl}/edit/main/`,
                },
                theme: {
                    customCss: require.resolve("./src/css/custom.css"),
                },
                googleAnalytics: {
                    trackingID: "UA-102219959-1",
                },
            },
        ],
    ],
    plugins: [
        "./postcss-tailwind-loader",
        [
            'content-docs',
            /** @type {import('@docusaurus/plugin-content-docs').Options} */
            ({
                id: 'contribute',
                path: 'contribute',
                routeBasePath: 'contribute',
                showLastUpdateAuthor: true,
                showLastUpdateTime: true,
                sidebarPath: require.resolve('./sidebarsDevelopment.js'),
                editUrl: `${githubSiteUrl}/edit/main`,
            }),
        ],
        [
            "content-docs",
            /** @type {import('@docusaurus/plugin-content-docs').Options} */
            ({
                id: "release-notes",
                path: "release-notes",
                routeBasePath: "release-notes",
                editUrl: `${githubSiteUrl}/edit/main`,
                sidebarPath: require.resolve("./sidebarsReleaseNotes.js"),
            }),
        ],
        [
            "content-docs",
            /** @type {import('@docusaurus/plugin-content-docs').Options} */
            ({
                id: "security",
                path: "security",
                routeBasePath: "security",
                sidebarPath: false,
            }),
        ],
        [
          "content-docs",
          /** @type {import('@docusaurus/plugin-content-docs').Options} */
          ({
            id: "client-feature-matrix",
            path: "client-feature-matrix",
            routeBasePath: "client-feature-matrix",
            sidebarPath: false,
          }),
        ],
    ],
    scripts: [
        {src: "/js/sine-waves.min.js", async: true},
        "/js/matomo-agent.js",
    ],
    clientModules: [require.resolve('./matomoClientModule.ts')],
    stylesheets: [
        {
          href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
          type: 'text/css',
          integrity:
            'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
          crossorigin: 'anonymous',
        },
      ],
};
