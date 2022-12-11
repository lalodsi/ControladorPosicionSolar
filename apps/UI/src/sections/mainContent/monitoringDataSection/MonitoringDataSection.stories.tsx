import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import MonitoringDataSection from '.';
import ComponentViewer from '../../../components/core/componentViewer';

export default {
  title: 'Monitoring Data Section',
  component: MonitoringDataSection,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof MonitoringDataSection>;

const Template: ComponentStory<typeof MonitoringDataSection> = (args) =>
  (
    <ComponentViewer >
      <MonitoringDataSection {...args} />
    </ComponentViewer>
  )
;

export const Normal = Template.bind({});
Normal.args = {
    conectado : false,
    esperando : false
};
