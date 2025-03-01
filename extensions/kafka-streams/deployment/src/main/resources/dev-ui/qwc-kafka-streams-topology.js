import { QwcHotReloadElement, html, css } from 'qwc-hot-reload-element';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { JsonRpc } from 'jsonrpc';

import { Graphviz } from "@hpcc-js/wasm/graphviz.js";

import '@vaadin/details';
import '@vaadin/tabs';
import '@vaadin/vertical-layout';
import 'qui-badge';
import 'qui-code-block';

/**
 * This component shows the Kafka Streams Topology
 */
export class QwcKafkaStreamsTopology extends QwcHotReloadElement {

    jsonRpc = new JsonRpc(this);

    static styles = css`
        .codeBlock {
            width: 100%;
            height: auto;
        }
    `;

    static properties = {
        _topology: {state: true},
        _graphviz: {state: true},
        _tabContent: {state: true}
    };

    constructor() {
        super();
        this._topology = null;
        this._graphviz = null;
        this._tabContent = '';
    }

    connectedCallback() {
        super.connectedCallback();
        Graphviz.load().then(r => this._graphviz = r);
        this.hotReload()
    }

    render() {
        if (this._topology) {
            return html`<vaadin-tabs @selected-changed="${(e) => this._tabSelectedChanged(e.detail.value)}">
                          <vaadin-tab id="graphTab">Graph</vaadin-tab>
                          <vaadin-tab id="detailsTab">Details</vaadin-tab>
                          <vaadin-tab id="describeTab">Describe</vaadin-tab>
                          <vaadin-tab id="graphvizTab">Graphviz</vaadin-tab>
                          <vaadin-tab id="mermaidTab">Mermaid</vaadin-tab>
                        </vaadin-tabs>
                        <vaadin-vertical-layout theme="padding"><p>${this._tabContent}</p></vaadin-vertical-layout>`;
        }

        return html`<qwc-no-data message="You do not have any Topology."
                                    link="https://quarkus.io/guides/kafka-streams"
                                linkText="Learn how to write Kafka Streams">
                    </qwc-no-data>`;
    }

    hotReload() {
        this._topology = null;
        this.jsonRpc.getTopology().then(jsonRpcResponse => {
            this._topology = jsonRpcResponse.result;
        });
    }

    _tabSelectedChanged(n) {
      switch(n) {
        case 1 : this._selectDetailsTab(); break;
        case 2 : this._selectDescribeTab(); break;
        case 3 : this._selectGraphvizTab(); break;
        case 4 : this._selectMermaidTab(); break;
        default : this._selectGraphTab();
      }
    }

    _selectGraphTab() {
      if (this._graphviz) {
        let g = this._graphviz.dot(this._topology.graphviz);
        this._tabContent = html`${unsafeHTML(g)}`;
      } else {
        this._tabContent = html`Graph engine not started.`;
      }
    }

    _selectDetailsTab() {
      this._tabContent = html`<table>
                                <tr>
                                  <td>Sub-topologies</td><td><qui-badge>${this._topology.subTopologies.length}</qui-badge></td>
                                  <td>${this._topology.subTopologies.map((subTopology) => html`<qui-badge level="contrast" icon="font-awesome-solid:diagram-project" style="margin-right:5px">${subTopology}</qui-badge>`)}</td>
                                </tr>
                                <tr>
                                  <td>Sources</td><td><qui-badge>${this._topology.sources.length}</qui-badge></td>
                                  <td>${this._topology.sources.map((source) => html`<qui-badge level="contrast" icon="font-awesome-solid:right-to-bracket" style="margin-right:5px">${source}</qui-badge>`)}</td>
                                </tr>
                                <tr>
                                  <td>Sinks</td><td><qui-badge>${this._topology.sinks.length}</qui-badge></td>
                                  <td>${this._topology.sinks.map((sink) => html`<qui-badge level="contrast" icon="font-awesome-solid:right-from-bracket" style="margin-right:5px">${sink}</qui-badge>`)}</td>
                                </tr>
                                <tr>
                                  <td>Stores</td><td><qui-badge>${this._topology.stores.length}</qui-badge></td>
                                  <td>${this._topology.stores.map((store) => html`<qui-badge level="contrast" icon="font-awesome-solid:database" style="margin-right:5px">${store}</qui-badge>`)}</td>
                                </tr>
                              </table>`;
    }

    _selectDescribeTab() {
      this._tabContent = html`<qui-code-block mode='text' content='${this._topology.describe}' class="codeBlock"></qui-code-block>`;
    }

    _selectGraphvizTab() {
      this._tabContent = html`<qui-code-block mode='gv' content='${this._topology.graphviz}' class="codeBlock"></qui-code-block>`;
    }

    _selectMermaidTab() {
      this._tabContent = html`<qui-code-block mode='mermaid' content='${this._topology.mermaid}' class="codeBlock"></qui-code-block>`;
    }
}
customElements.define('qwc-kafka-streams-topology', QwcKafkaStreamsTopology);