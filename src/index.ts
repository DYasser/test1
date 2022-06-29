import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette} from '@jupyterlab/apputils';

import { IFrame, MainAreaWidget} from '@jupyterlab/apputils';
 
async function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette
):Promise<void> {
  console.log('JupyterLab extension Gallery is activated!');
  const command: string = 'gallery:open';
  app.commands.addCommand(command, {
    label: `Gallery`,
    execute: () => 
    {
      let content = new IFrame({
        sandbox: ['allow-scripts', 'allow-forms', 'allow-same-origin']
      });
      content.url = "https://swan-gallery.web.cern.ch/";
      content.title.label = "Gallery";
      let widget = new MainAreaWidget({ content });
      widget.id = 'swan-gallery';
      widget.title.closable = true;
      app.shell.add(widget, 'main');
      app.shell.activateById(widget.id);
    }
  });
  // Add the command to the palette.
  palette.addItem({ command, category: 'Tutorial' });
}

const extension: JupyterFrontEndPlugin<void> = {
  id: 'test1:plugin',
  requires: [ICommandPalette],
  autoStart: true,
  activate: activate
};

export default extension;
