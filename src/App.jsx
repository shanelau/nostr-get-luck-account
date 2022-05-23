import { useState, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom';
//@ts-ignore
import { generatePrivateKey, getPublicKey } from './nostr.js'
import { RadioGroup, Radio } from 'react-radio-group'
import logo from './logo.svg'
import './App.css'

const times = 100000
function App() {
  const [result, setResult] = useState([])
  const [selectVal, setSelectVal] = useState({'pre': undefined, 'back': undefined})
  const [searchState, setSearchState] = useState('start') // seaching, end, start
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
    console.log(JSON.stringify({
      index,
      publicKey: pub,
      privateKey: pk
    }))

    currentCal = { index, begin, end }
    // if (+index % 100 == 0) document.querySelector('#search').innerHTML = `<p>Search #${currentCal.index} : ${currentCal.begin}...${currentCal.end} </p>`
    // 以 xxx 开头
    // if (type === 'begin_custom_radio' && begin_custom){
    //   if(!begin.startsWith(begin_custom)) return
    // }
    // 以 xx 结尾
    // if (type2 === 'end_custom_radio' && end_custom) {
    //   if (!end.endsWith(end_custom)) return
    // }

    const beginTick = +selectVal['pre']
    const endTick = +selectVal['back']
    if (beginTick){
      const r1 = charIsEqual(begin, beginTick)
      if (!r1) return
      if(endTick){
        const r2 = charIsEqual(end.split('').reverse(), endTick)
        if(!r2) return
      }
      return { publicKey: pub, privateKey: pk}//privateKey:{pk} 
    }else{
      if (endTick) {
        const r2 = charIsEqual(end.split('').reverse(), endTick)
        if (!r2) return
      }
      return { publicKey: pub, privateKey: pk} //privateKey:{pk} 
    }
  }

  function tryAgain() {
    flushSync(() => {
      setSearchState('searching')
    })
    setTimeout(() => {
    const list = []
    for (let index = 0; index < times; index++) {
      const res = getPks(index)
      // console.log(res)
      if (res) {
        // clearInterval(roop)
        setResult(res)
        setSearchState('end')
        return
      }
      // if(index === times -1){
      //   clearInterval(roop)
      // }
    }
      setSearchState('end')
    }, 0)    
  }

  const ruleArr = new Array(6).fill(undefined)

  const handleRuleClick = (position, index) => {
    setSelectVal({...selectVal, [position]: index})
    setSearchState('start')
  }
  const getRule = (position = 'pre') => {
    let preStr = 'A'
    let endStr = '*'
    if(position === 'back') {
      preStr = '*'
      endStr = 'A'
    }
    
    return <div className='ruleWrap'>{[...ruleArr, undefined].map((item,index) => {
      return <div className={'ruleItem ' + (selectVal[position] === index && 'selected')} onClick={() => handleRuleClick(position,index)}>
        {new Array(ruleArr.length - index).fill(undefined).map(() => preStr).join('')}{new Array(index).fill(undefined).map(() => endStr).join('')}
        </div>
    })}</div>
  }
  console.log(result, searchState)
  return (
    <div className="App" ref={currNode}>
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1 style={{ lineHeight: '1px' }}>Create Cool Address For <a href='https://astral.ninja'>Nostr</a></h1>
        <div className='desc'><p>1. Create a cool address as: 66666.....cccccc</p> 
          <p>2. The more identical characters, it takes longer</p>
          <p>3. No Trust. You can execute when closing the network. Open Source on <a href='https://github.com/shanelau/nostr-get-luck-account'>Github</a></p>
          <p>4. Press F12 to view the details</p>
          <p>5. Follow me on Nostr: 0000a0fa65fcccd99e6fd32fc7870339af40f4a94703ea30999fc5c091daa222</p>
      </div>

<div className='searchBar' style={{paddingTop: 50}}>
          <pre>Begin Chars:</pre>
        {getRule('pre')}
        
          {/* <Radio value="begin_custom_radio" /><input value={begin_custom} onChange={(e)=>{
              // 报错提示: a-e 0-9
              setBegin_custom(e.target.value)
          }} />
        */}
        </div>
        <div className='searchBar'>
          <pre>End   Chars:</pre>
        {getRule('back')}
        {/* 
            <Radio value="end_custom_radio" /><input value={end_custom} onChange={(e) => {
              setEnd_custom(e.target.value)
            }}></input>
         */}
        </div>
        {/* <div> 每次尝试：<input value={times} onChange={(e) => {
          setTimes(e.target.value)
        }} /> 个钱包</div> */}
        {
          (selectVal.pre !== undefined || selectVal.back !== undefined ) &&
          <div>
              <button type="button" onClick={tryAgain} role="button" className='searchBtn'>
              Search Wallet
            </button>
        </div>
        }
        {
          searchState === 'searching' && <div>Searching...</div>
        }
        {
          searchState === 'end' && 
          <div>{result ? 
            <div id='searchResult'>
              <div >publicKey: <span >{result.publicKey}</span></div>
              <div >privateKey: <span >{result.privateKey}</span></div>
                <button className='button-17' 
              onClick={() => copyToClipBoard(`
                publickKey: ${result.publicKey}
                privateKey: ${result.privateKey}
              `)}>Copy</button>
            </div> : 
          'no result, start again'}
          </div>
        }
      </header>
    </div>
  )
}

export default App

function copyToClipBoard(content){

  navigator.clipboard.writeText(content)
      .then(() => {
      console.log("Text copied to clipboard...")
  })
      .catch(err => {
      console.log('Something went wrong', err);
  })

}