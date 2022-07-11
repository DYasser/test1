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
        sandbox: ['allow-scripts', 'allow-forms', 'allow-same-origin', 'allow-modals', 'allow-downloads']
      });

      window.addEventListener('message', event => {
          console.log(event.data);
        }); 
        

      content.url = "http://127.0.0.1:8080/test.html";
      content.title.label = "Gallery";
      let widget = new MainAreaWidget({ content });
      widget.id = 'swan-gallery';
      widget.title.closable = true;
      app.shell.add(widget, 'main');
      app.shell.activateById(widget.id);
    }
  });
  
  palette.addItem({ command, category: 'Tutorial' });
}

const extension: JupyterFrontEndPlugin<void> = {
  id: 'test1:plugin',
  requires: [ICommandPalette],
  autoStart: true,
  activate: activate
};
 

export default extension;