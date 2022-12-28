import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Modal from '.';
import ComponentViewer, { ComponentViewerTypes } from '../componentViewer';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Modal',
  component: Modal,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Modal>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Modal> = (args) => (
    <ComponentViewer type={ComponentViewerTypes.light}>
        <Modal {...args} >
            Este es un modal
        </Modal>
    </ComponentViewer>
);

export const Common = Template.bind({});
Common.args = {
};