import React from 'react'
import Container from '../../../components/core/container'
import Loading, { LoadingTypes } from '../../../components/core/loading'
import Text, { TextType } from '../../../components/core/text'

type LoadingSectionProps = {
    text: string
}

const LoadingSection: React.FC<LoadingSectionProps> = (props) => {
    const {
        text
    } = props
    return (
        <Container type="section" align="center"  >
            <Text type={TextType.header} content={text} />
            <Loading type={LoadingTypes.waiting} />
        </Container >
    )
}

export default LoadingSection