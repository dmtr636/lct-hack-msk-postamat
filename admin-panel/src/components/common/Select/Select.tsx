import React, {useState} from 'react'
import styles from "./Select.module.scss"
import classNames from "classnames";
import {observer} from "mobx-react-lite";

export interface ISelectOption {
    value: string,
    name: string
}

export const Select = observer((props: {
    options: ISelectOption[],
    value: string,
    onChange: (value: string) => void,
    className?: string,
}) => {
    const [isOpen, setOpen] = useState(false)

    const selectedOption = props.options.find(option => option.value === props.value)

    const handleChange = (value: string) => {
        props.onChange(value)
        setOpen(false)
    }

    return (
        <div className={styles.container}>
            <div
                className={classNames(styles.select, styles.selectActive, props.className)}
                onClick={() => setOpen(!isOpen)}
            >
                <div className={styles.selectedOption}>
                    {selectedOption?.name}
                </div>
                <div
                    className={styles.arrow}
                    style={{transform: `rotate(${isOpen ? "180deg" : "0"})`}}
                />
            </div>
            {isOpen &&
                <>
                    <div className={styles.popover}>
                        {props.options.map(option =>
                            <div
                                className={classNames(
                                    styles.listItem,
                                    {[styles.listItemActive]: selectedOption === option}
                                )}
                                onClick={() => handleChange(option.value)}
                            >
                                {option.name}
                            </div>
                        )}
                    </div>
                    <div
                        className={styles.overlay}
                        onClick={() => setOpen(false)}
                    />
                </>
            }
        </div>
    );
});
