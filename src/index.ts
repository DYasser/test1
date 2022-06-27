import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette} from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';

import {request} from "requests-helper";

import "../style/base.css";

let path = "";

class APODWidget extends Widget {
  constructor() {
    super();

    path = "https://swan-gallery.web.cern.ch/";
    this.init();
  }

  async init(){
    const div = document.createElement("div");
    div.classList.add("iframe-widget");
    const iframe = document.createElement("iframe");

    // First try to get directly
    const res = await request("get", path);
    if (res.ok && !res.headers.includes("Access-Control-Allow-Origin")) {
      // Site does not disable iframe

      // eslint-disable-next-line no-console
      console.log("site accessible: proceeding");

      iframe.src = path;
    }

    div.appendChild(iframe);
    this.node.appendChild(div);
  }
}

function activate(app: JupyterFrontEnd, palette: ICommandPalette) {
  console.log('JupyterLab extension Gallery is activated!');

  // Add an application command
  const command: string = 'gallery:open';
  app.commands.addCommand(command, {
    label: 'Gallery',
    execute: () => {      
      // Create a single widget
      let widget = new APODWidget();
      widget.id = 'swan-gallery';
      widget.title.label = 'SWAN Gallery';
      widget.title.closable = true;
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, 'main');
      }
      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette.
  palette.addItem({ command, category: 'Sites' });
}

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'test1:plugin',
  autoStart: true,
  requires: [ICommandPalette],
  activate
    
};

export default plugin;
 