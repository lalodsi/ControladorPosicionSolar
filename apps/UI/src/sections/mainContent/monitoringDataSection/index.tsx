import React from 'react'
import Text, { TextType } from '../../../components/core/text'
import Container, { ContainerType } from '../../../components/core/container'
import "./styles.css"
import data from "./data"

type MonitoringDataSectionProps = {}

const MonitoringDataSection: React.FC<MonitoringDataSectionProps> = (props) => {
    return (
        <Container type="section" scroll={true}>
            {
                data.map(value => value.type === "Text" ?
                    <Text
                        type={value.textType? value.textType : TextType.header}
                        content={typeof value.content === "string"? value.content : "" }
                    />
                    :
                    <Container type="doubleColumns">
                        {
                            typeof (value.content) !== "string" &&
                            <React.Fragment>
                                {
                                    value.content.map(val => 
                                        <React.Fragment>
                                            <Text type={TextType.normal} content={val.title} />
                                            <Text type={TextType.dato} content={val.value} />
                                        </React.Fragment>
                                    )
                                }
                            </React.Fragment>
                        }
                    </Container>
                )
            }
        </Container>
    )
}

export default MonitoringDataSection