import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import LoadingSection from '.';
import ComponentViewer from '../../../components/core/componentViewer';

export default {
  title: 'Loading Section',
  component: LoadingSection,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof LoadingSection>;

const Template: ComponentStory<typeof LoadingSection> = (args) =>
  (
    <ComponentViewer>
      <LoadingSection {...args} />
    </ComponentViewer>
  )
;

export const Default = Template.bind({});
Default.args = {
    text: "Cargando sección"
}
