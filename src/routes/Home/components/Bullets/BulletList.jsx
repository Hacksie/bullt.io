import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { useFirestoreConnect, useFirestore } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { BULLETS_COLLECTION } from 'constants/firebasePaths'
import { INDICATORS, OPEN_INDICATOR } from './indicatorconstants'
import ContentEditable from 'react-contenteditable'
import './Bullets.css'

function BulletList() {
  const { rootId } = useParams()
  const fs = useFirestore();
  useFirestoreConnect([{ collection: BULLETS_COLLECTION, where: [['tree', 'array-contains', rootId ? rootId.toString() : '']], orderBy: "id" }])
  const [selected, setSelected] = useState(null)

  const selectItem = (e) => {
    var target = e.target
    if (!target.id) {
      target = e.target.parentNode
    }

    if (!target) {
      console.warn("No target to select")
      setSelected(undefined);
      return
    }

    setSelected(target.id);
  }


  const getId = (node) => node.id ? node.id : node.parentNode.id;

  const bulletHasChildren = (id) => {
    let entries = Object.entries(root);
    if (!entries)
      return false;

    return entries.some(i => i[1].tree.indexOf(id) > -1)

  }

  const getNextId = () => {
    let entries = Object.entries(root);
    if (!entries)
      return 0;

    return (Math.max.apply(Math, entries.map((i) => parseInt(i[1].id))) + 1).toString();
  }

  const split = (id, content, start, end) => {
    let entries = Object.entries(root);
    if (!entries)
      return;

    const item = entries.find(i => i[0] === id)

    const children = bulletHasChildren(item[1].id);
    console.log(id);
    console.log('has children', children);

    var nextId = getNextId();

    const left = content.slice(0, start);
    const right = content.slice(end, content.length);

    const newTree = item[1].tree;
    newTree[newTree.length - 1] = nextId;

    fs.collection(BULLETS_COLLECTION).add({ content: right, tree: newTree, id: nextId })
    fs.collection(BULLETS_COLLECTION).doc(id).update({ content: left })
  }

  const remove = (id) => {
    fs.collection(BULLETS_COLLECTION).doc(id).delete();
  }

  const keyhandler = (e) => {

    const id = getId(e.target);

    console.log(e.key);
    switch (e.key) {
      case 'Enter':
        var range = window.getSelection().getRangeAt(0);

        if (range.startContainer.parentNode === e.target && range.endContainer.parentNode === e.target) {
          split(id, e.target.innerText, range.startOffset, range.endOffset);
        }
        else {
          console.log('target doesn\'t match selection range');
          console.log(e.target);
          console.log(range.startContainer.id);
        }
        e.preventDefault();
        return;

      case 'Backspace':
        var test = /^\s$/;

        if (test.test(e.target.innerText)) {
          console.log('remove');
          remove(id);
        }
        break;
      default:
        break;
    }


  }

  const updateContent = (e) => {
    const id = getId(e.target);

    if (!id) {
      console.warn("No target to update")
      return
    }

    fs.collection(BULLETS_COLLECTION).doc(id).update({ content: e.target.innerText })
  }

  const handleIndicatorClick = (e) => {
    const id = getId(e.target);

    if (!id) {
      console.warn("No target to update")
      return
    }

    const entries = Object.entries(root);
    if (!entries) {
      console.warn("Still loading")
      return
    }

    const item = entries.find(item => item[0] === id)

    let content = item[1].content

    var indicator = calcIndicator(content)


    var i = INDICATORS.indexOf(indicator);
    i++;

    if (i >= INDICATORS.length) {
      i = 0;
    }

    let newIndicator = INDICATORS[i];

    if (newIndicator === OPEN_INDICATOR) {
      newIndicator = ''
    }
    content = content.replace("!" + indicator, '')

    content += newIndicator !== '' ? " !" + newIndicator : '';

    fs.collection(BULLETS_COLLECTION).doc(id).update({
      content: content
    })
  }


  const calcIndicator = (content) => {
    if (content === undefined)
      return OPEN_INDICATOR

    const indicator = INDICATORS.find(i => content.indexOf('!' + i) !== -1)

    if (indicator) {
      return indicator;
    }
    else {
      return OPEN_INDICATOR
    }
  }

  // Get projects from redux state
  const root = useSelector((state) => state.firestore.data.bullets)

  const renderBreadcrumbs = (entries) => {
    if (!rootId) {
      return <Breadcrumb><BreadcrumbItem key='Home'><Link to="/">Home</Link></BreadcrumbItem></Breadcrumb>
    }
    else {
      let rootItem = entries.find(item => item[1].id === rootId);

      if (!rootItem)
        return <Breadcrumb>loading...</Breadcrumb>

      return (
        <Breadcrumb>{rootItem[1].tree.map(branch => {
          return <BreadcrumbItem key={`${branch ? branch : 'home'}`}><Link to={`/${branch}`}>{branch ? branch : 'Home'}</Link></BreadcrumbItem>
        })}
        </Breadcrumb>)
    }
  }

  const renderBullet = (item, level, itemClass, showLink) => {

    if (!item) {
      return <div>Loading...</div>
    }

    const link = showLink ? <Link className="handle link" to={`/${item[1].id}`} /> : '';
    return (
      <div id={item[0]} onClick={selectItem} className={`${itemClass} ${item[0] === selected ? "selected" : ""}`}>
        {(() => {
          if (level > 0) {
            return <span className="childindicator" style={{ width: (3 * level) + "em" }}>&nbsp;</span>
          }
        })()}
        <span className={`indicator ${calcIndicator(item[1].content)}`} onClick={handleIndicatorClick}></span>
        <ContentEditable className="itemDesc" html={item[1].content} onKeyDown={keyhandler} onBlur={updateContent} suppressContentEditableWarning={true} />
        {link}

      </div>)
  }

  const renderBullets = (entries, rootId, level) => {
    if (entries === undefined)
      return (<div>empty</div>)

    // FIXME: check that array index lookup!
    return (
      entries.filter((item) => item && item[1] && item[1].tree[item[1].tree.length - 2] === (rootId ? rootId : '')).map((bullet) => (
        <div key={bullet[0]}>
          {renderBullet(bullet, level, 'item', true)}
          {renderBullets(entries, bullet[1].id, level + 1)}
        </div>
      )))
  }

  return (
    <section>
      {root && renderBreadcrumbs(Object.entries(root), rootId)}
      {(() => {
        if (root && rootId) {
          let rootItem = Object.entries(root).find(item => item[1].id === rootId);
          return (() => renderBullet(rootItem, 0, 'item', false))()
        }
      })()}

      {root ? renderBullets(Object.entries(root), rootId, rootId ? 1 : 0) : (<div>Loading...</div>)}

    </section>)
}
export default BulletList
