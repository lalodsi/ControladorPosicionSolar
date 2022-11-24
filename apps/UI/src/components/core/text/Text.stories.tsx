import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import Text, { TextType } from ".";
import ComponentViewer, { ComponentViewerTypes } from "../componentViewer";

export default {
    title: "Text Component",
    component: Text
} as ComponentMeta<typeof Text>

export const TextHeader: ComponentStory<typeof Text> = () => (
        <ComponentViewer type={ComponentViewerTypes.dark}>
            <Text type={TextType.header} content="abcdefghijklmnopqrstuvwxyz" />
        </ComponentViewer>
    )
export const TextSubheader: ComponentStory<typeof Text> = () => (
        <ComponentViewer type={ComponentViewerTypes.dark}>
            <Text type={TextType.subheader} content="abcdefghijklmnopqrstuvwxyz" />
        </ComponentViewer>
    )
export const TextDato: ComponentStory<typeof Text> = () => (
        <ComponentViewer type={ComponentViewerTypes.light}>
            <Text type={TextType.dato} content="abcdefghijklmnopqrstuvwxyz" />
        </ComponentViewer>
    )
export const TextInfo: ComponentStory<typeof Text> = () => (
        <ComponentViewer type={ComponentViewerTypes.dark}>
            <Text type={TextType.info} content="abcdefghijklmnopqrstuvwxyz" />
        </ComponentViewer>
    )