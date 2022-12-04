import React from 'react'
import Button, { buttonTypes } from '../../core/button';
import Container, { ContainerType } from '../../core/container';
import "./styles.css";

type NavigationSectionProps = {}

const NavigationSection = (props: NavigationSectionProps) => {
  return (
    <Container type="subsection" >
      <Button text='Modo de Monitoreo' className={buttonTypes.commonButton} handleClick={() => {}} />
      <Button text='Modo de control manual' className={buttonTypes.commonButton} handleClick={() => {}} />
      <Button text='Modo de calibración' className={buttonTypes.commonButton} handleClick={() => {}} />
    </Container>
  )
}

export default NavigationSection;