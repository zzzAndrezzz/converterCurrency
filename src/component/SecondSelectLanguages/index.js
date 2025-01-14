import React, {memo, useEffect, useRef, useState} from 'react';
import clsx from "clsx";
import {useDispatch, useSelector} from "react-redux";
import {setSecondChecked, setSecondValue} from "../../redux/slice/valueSlice";

import Arrow from "../../constans/svg/Arrow";
import classes from './styles.module.scss';


const SecondSelectLanguages = ({data, handleAmountChange}) => {
  const [activeSelect, setActiveSelect] = useState(false)
  const [option, setOption] = useState([])
  const secondValue = useSelector((state) => state.value.secondValue)
  const firstValue = useSelector((state) => state.value.firstValue)
  const checkedId2 = useSelector((state) => state.value.checkedId2)
  const dispatch = useDispatch()
  const ref = useRef()

  const selectLanguage = (value) => {
    const newOption = data.map(item => {
      if (item.cc === value) {
        item.checkedSecond = true
        dispatch(setSecondChecked(item.id))
      } else {
        item.checkedSecond = false
      }
      return item
    })
    setOption(newOption)
    setActiveSelect(false)
  }
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.path.includes(ref.current)) {
        setActiveSelect(false)
      }
    }
    document.body.addEventListener('click', handleClickOutside)
    return () => document.body.removeEventListener('click', handleClickOutside)
  }, [])

  const sum = () =>{
    return firstValue / (secondValue * data[checkedId2].rate)
  }

  useEffect(() => {
    if (data.length && checkedId2) {
      dispatch(setSecondValue(sum()))
    }
  }, [activeSelect])

  return (
    <div ref={ref} className={classes.root}>
      <div className={classes.select}>
        <div className={classes.select_currency}>
          {
            option.length
              ?
              option.map((item, index) => {
                if (item.checkedSecond) {
                  return (
                    <p key={item.cc}>{item.img} {item.cc}</p>
                  )
                }
                return null
              })
              :
              <p>Оберіть Валюту</p>
          }
        </div>
        <Arrow
          onClick={() => setActiveSelect(!activeSelect)}
          className={clsx(classes.arrow,{
            [classes.arrow_active]: activeSelect
          })}
        />
        <ul
          className={clsx(classes.ul, {
            [classes.active]: activeSelect
          })}>
          {data.map(item => (
            <li key={item.cc}
                onClick={() => selectLanguage(item.cc)}
            >
              {item.img}
              <p>{item.cc}</p>
            </li>
          ))}
        </ul>
      </div>
      <input
        type="number"
        value={secondValue}
        disabled={!option.length}
        onChange={e => handleAmountChange(e.target.value)}/>
    </div>
  );
};

export default memo(SecondSelectLanguages);