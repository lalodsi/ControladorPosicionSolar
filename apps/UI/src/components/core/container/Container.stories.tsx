import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Container from '.';
import ComponentViewer, { ComponentViewerTypes } from '../componentViewer';


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Container',
  component: Container,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Container>;

export const Section = () => (
    <ComponentViewer type={ComponentViewerTypes.light}>
        <Container type="section" align="center" scroll={true}>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
        </Container>
    </ComponentViewer>
)
export const Subsection = () => (
    <ComponentViewer type={ComponentViewerTypes.light}>
        <Container type="subsection" align="center" scroll={true} >
            Text
        </Container>
    </ComponentViewer>
)

export const DoubleColumns = () => (
    <ComponentViewer type={ComponentViewerTypes.light}>
        <Container type="section" >
            <Container type="doubleColumns" >
                {/* <p>Azimut</p><input name="arduinoMotorAzimut" type="number" value="0" id="azimut" /> */}
                <p>Sensor 1:</p> <p className="dato" id="showSensores">####</p>
            </Container>
        </Container>
    </ComponentViewer>
)
