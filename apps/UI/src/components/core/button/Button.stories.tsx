import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button, { buttonTypes } from '.';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Common = Template.bind({});
Common.args = {
  text: "Prueba 1",
  className: buttonTypes.commonButton,
};

export const Connect = Template.bind({});
Connect.args = {
  text: "Boton Conectar",
  className: buttonTypes.connectButton
}

export const Disconnect = Template.bind({})
Disconnect.args = {
  text: "Desconectar",
  className: buttonTypes.connectButton
}

export const Disable = Template.bind({})
Disable.args = {
  text: "Deshabilitado",
  className: buttonTypes.disabledButton
}

export const Contenido = Template.bind({})
Contenido.args = {
  text: "Boton de Contenido",
  className: buttonTypes.contentButton
}

export const Serial = Template.bind({})
Serial.args = {
  text: "Enviar por el puerto Serie",
  className: buttonTypes.serialButton
}
