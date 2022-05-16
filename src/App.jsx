import { useState, useEffect, useRef } from 'react'
//@ts-ignore
import { generatePrivateKey, getPublicKey } from 'https://unpkg.com/nostr-tools/nostr.js'
import { RadioGroup, Radio } from 'react-radio-group'
import logo from './logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [listItems, setListItems] = useState([])
  const [type, setType] = useState('begin_custom_radio')
  const [type2, setType2] = useState('end_custom_radio')
  const [begin_custom, setBegin_custom] = useState('')
  const [end_custom, setEnd_custom] = useState('')
  const [search, setSearch] = useState({})
  const [times, setTimes] = useState(1)
  const currNode = useRef()

  function charIsEqual(str, tick) {
    // 开始4 位数以上相同
    const char1 = { ...str }
    for (let i = 1; i < tick; i++) {
      if (char1[i - 1] == char1[i]) {
        if (i == tick - 1) {
          return true
        }
        continue;
      }
      break
    }
    return false
  }

  let currentCal

  function getPks(index) {
    const pk = generatePrivateKey()
    const pub = getPublicKey(pk)

    const begin = pub.slice(0, 6)
    const end = pub.slice(pub.length - 6, pub.length)
    // console.log(JSON.stringify({
    //   index,
    //   publicKey: pub,
    //   privateKey: pk
    // }))

    currentCal = { index, begin, end }
    if (+index % 100 == 0) document.querySelector('#search').innerHTML = `<p>Search #${currentCal.index} : ${currentCal.begin}...${currentCal.end} </p>`
    // 以 xxx 开头
    if (type === 'begin_custom_radio' && begin_custom){
      if(!begin.startsWith(begin_custom)) return
    }
    // 以 xx 结尾
    if (type2 === 'end_custom_radio' && end_custom) {
      if (!end.endsWith(end_custom)) return
    }

    const beginTick = +type.split('_')[2]
    const endTick = +type2.split('_')[2]
    if (beginTick){
      const r1 = charIsEqual(begin, beginTick)
      if (!r1) return
      if(endTick){
        const r2 = charIsEqual(end.split('').reverse(), endTick)
        if(!r2) return
      }
      return <li key={pub}> publicKey: {pub} - {pk}</li> //privateKey:{pk} 
    }else{
      if (endTick) {
        const r2 = charIsEqual(end.split('').reverse(), endTick)
        if (!r2) return
      }
      return <li key={pub}> publicKey: {pub} - </li> //privateKey:{pk} 
    }
  }


  function tryAgain() {
    const list = []
    for (let index = 0; index < times; index++) {
      const res = getPks(index)
console.log(res)
      if (res) {
        // clearInterval(roop)
        setListItems([res])
        return
      }
      // if(index === times -1){
      //   clearInterval(roop)
      // }
    }
  }

  useEffect(() => {
    // tryAgain()
    // setInterval(function () {
    //   console.log('currentCal', currentCal)
    // }, 300)
  }, [])

  return (
    <div className="App" ref={currNode}>
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>Cool Address For Nostr</h1>
<div>
        前 6 个字符：
        <RadioGroup name="begin" selectedValue={type} onChange={setType}>
          <Radio value="begin_same_0" />******
          <Radio value="begin_same_1" />A*****
          <Radio value="begin_same_2" />AA****
          <Radio value="begin_same_3" />AAA***
          <Radio value="begin_same_4" />AAAA**
          <Radio value="begin_same_5" />AAAAA*
          <Radio value="begin_same_6" />AAAAAA
          <Radio value="begin_custom_radio" /><input value={begin_custom} onChange={(e)=>{
              // 报错提示: a-e 0-9
              setBegin_custom(e.target.value)
          }} />
        </RadioGroup>
        </div>
        <div>后6个字符
        <RadioGroup name="end" selectedValue={type2} onChange={setType2}>
          <Radio value="end_same_0" />******
          <Radio value="end_same_1" />*****A
          <Radio value="end_same_2" />****AA
          <Radio value="end_same_3" />***AAA
          <Radio value="end_same_4" />**AAAA
          <Radio value="end_same_5" />*AAAAA
          <Radio value="end_same_6" />AAAAAA
            <Radio value="end_custom_radio" /><input value={end_custom} onChange={(e) => {
              setEnd_custom(e.target.value)
            }}></input>
        </RadioGroup>
        </div>
        <div> 每次尝试：<input value={times} onChange={(e) => {
          setTimes(e.target.value)
        }} /> 个钱包</div>
        <p>
          <button type="button" onClick={() => tryAgain()}>
            Search Wallet
          </button>
        </p>
        <div id='search'></div>
        {listItems.length == 0 ? <p>Not found matched account</p> : <ul>{listItems}</ul>}
        {/* <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p> */}
      </header>
    </div>
  )
}

export default App
