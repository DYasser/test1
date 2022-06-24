import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette, MainAreaWidget} from '@jupyterlab/apputils';

//import {PageConfig} from "@jupyterlab/coreutils";

import { Widget } from '@lumino/widgets';

import {request} from "requests-helper";

import "../style/base.css";

let path = "";
let unique = 0;
let local_file = false;

class APODWidget extends Widget {
  constructor() {
    super();

    path = "https://swan-gallery.web.cern.ch/";
    this.init();
  }

  async init(){
    const iconClass = `favicon-${unique}`;
    this.title.iconClass = iconClass;
    this.title.label = path;
    this.title.closable = true;

    //local_file = path.startsWith("local://");

    unique += 1;

    /*if (!local_file && !path.startsWith("http")) {
      // use https, its 2020
      path = `https://${path}`;
    }*/

    const div = document.createElement("div");
    div.classList.add("iframe-widget");
    const iframe = document.createElement("iframe");

    if (!local_file) {
      // External website

      // First try to get directly
      const res = await request("get", path);
      if (res.ok && !res.headers.includes("Access-Control-Allow-Origin")) {
        // Site does not disable iframe

        // eslint-disable-next-line no-console
        console.log("site accessible: proceeding");

        iframe.src = path;

        const favicon_url = new URL("/favicon.ico", path).href;

        const res2 = await request("get", favicon_url);
        if (res2.ok) {
          const style = document.createElement("style");
          style.innerHTML = `div.${iconClass} { background: url("${favicon_url}"); }`;
          document.head.appendChild(style);
        }
      } /*else {
        // Site is blocked for some reason, so attempt to proxy through python.
        // Reasons include: disallowing iframes, http/https mismatch, etc

        // eslint-disable-next-line no-console
        console.log(`site failed with code ${res.status.toString()}`);

        // eslint-disable-next-line no-empty
        if (res.status === 404) {

        } else {
          // otherwise try to proxy
          const favicon_url = `${PageConfig.getBaseUrl()}iframes/proxy?path=${new URL("/favicon.ico", path).href}`;

          path = `iframes/proxy?path=${encodeURI(path)}`;
          iframe.src = PageConfig.getBaseUrl() + path;
          // eslint-disable-next-line no-console
          console.log(`setting proxy for ${path}`);

          const res2 = await request("get", favicon_url);
          if (res2.ok) {
            const style = document.createElement("style");
            style.innerHTML = `div.${iconClass} { background: url("${favicon_url}"); }`;
            document.head.appendChild(style);
          }
        }
      }*/
    } /*else {
      // Local file, replace url and query for local
      // eslint-disable-next-line no-console
      console.log(`fetching local file ${path}`);
      path = `iframes/local?path=${encodeURI(path.replace("local://", ""))}`;
      iframe.src = PageConfig.getBaseUrl() + path;
      }*/

    div.appendChild(iframe);
    this.node.appendChild(div);
  }
}

function activate(app: JupyterFrontEnd, palette: ICommandPalette) {
  console.log('JupyterLab extension Gallery is activated!');

  // Add an application command
  const command: string = 'apod:open';
  app.commands.addCommand(command, {
    label: 'Gallery',
    execute: () => {      
      // Create a single widget
      const content = new APODWidget();
      const widget = new MainAreaWidget({content});
      widget.id = 'swan-gallery';
      widget.title.label = 'SWAN Gallery';
      widget.title.closable = true;
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, 'main');
      }
      // Refresh the picture in the widget
      content.update();
      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette.
  palette.addItem({ command, category: 'Tutorial' });
}

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'test1:plugin',
  autoStart: true,
  requires: [ICommandPalette],
  activate: activate
    
};

export default plugin;
