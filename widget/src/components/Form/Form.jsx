import React from 'react'
import styles from "./Form.module.scss"
import { FirstStep } from '../firstStep/firstStep'
import { SecondStep } from '../SecondStep/SecondStep';
import { Succesfull } from '../Succesfull/Succesfull';

export const Form = () => {
  const [name, setName] = React.useState();
  const [tel, setTel] = React.useState();
  const [step, setStep] = React.useState(1);
  
  return (
    <div className={styles.body}>
        {step===1?<FirstStep name={name} tel={tel} SetStep={setStep} setTel={setTel} SetName={setName} />:<></>}
        {step===2?<SecondStep name={name} tel={tel} SetStep={setStep} setTel={setTel} SetName={setName} />:<></>}
        {step===3?<Succesfull SetStep={setStep} />:<></>}
    </div>
  )
}
