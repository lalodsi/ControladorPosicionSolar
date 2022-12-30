import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Popup from '.';
import CenterElements from '../../core/componentViewer';
import Container, { ContainerType } from '../../core/container';
import Button, { buttonTypes } from '../button';

export default {
  title: 'Popup',
  component: Popup,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Popup>;

let componentType: "alert" | "error" | "success" = "success";
const Template: ComponentStory<typeof Popup> = (args) => {

    const [click, setClick] = React.useState(false);
    const [type, setType] = React.useState<"alert" | "error" | "success">("alert");
    const [message, setMessage] = React.useState<string>("");
    const handlePress = (type: "alert" | "error" | "success") => {
        setType(type);
        setClick(true);
        setTimeout(() => setClick(false), args.time);
        switch (type) {
            case "alert":
                setMessage("Esta es una alerta");
                break;
            case "error":
                setMessage("Este es un mensaje de error");
                break;
            case "success":
                setMessage("Este es un mensaje de exitoso");
                break;
            default:
                break;
        }
    }

    return (
        <CenterElements >
            <Container type="section">
                <Button
                    text='Show alert'
                    className={buttonTypes.commonButton}
                    handleClick={() => handlePress("alert")}
                />
                <Button
                    text='Show error'
                    className={buttonTypes.commonButton}
                    handleClick={() => handlePress("error")}
                />
                <Button
                    text='Show success'
                    className={buttonTypes.commonButton}
                    handleClick={() => handlePress("success")}
                />
                {
                    click && (
                        <Popup
                            message={message}
                            type={type}
                            time={args.time}
                        />
                    )
                }
            </Container>
        </CenterElements>
    )
}
;

export const Normal = Template.bind({});
Normal.args = {
    time: 2000
};
