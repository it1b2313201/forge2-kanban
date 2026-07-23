import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const labels = {
  design: { name: 'Design', color: '#c4b5fd' },
  frontend: { name: 'Frontend', color: '#7dd3fc' },
  backend: { name: 'Backend', color: '#6ee7b7' },
  bug: { name: 'Bug', color: '#fda4af' },
};

const initialBoards = [{
  id: 'launch',
  name: 'Launch control',
  description: 'A focused Kanban for the work that matters.',
  lists: [
    { id: 'todo', name: 'To do', cards: [{ id: 'a', title: 'Define API contract', description: 'Map the board, list, and card endpoints before implementation.', tags: ['design'], member: 'Aarav', due: '2026-07-28' }] },
    { id: 'doing', name: 'In progress', cards: [{ id: 'b', title: 'Build board interface', description: 'Create the responsive React Kanban experience.', tags: ['frontend'], member: 'Maya', due: '2026-07-25' }] },
    { id: 'done', name: 'Done', cards: [{ id: 'c', title: 'Create SQLite schema', description: 'Migrations for core board entities are ready.', tags: ['backend'], member: 'Aarav', due: '2026-07-22' }] },
  ],
}];

const storageKey = 'forge-kanban-v2';
const uid = () => crypto.randomUUID();
const dateLabel = date => date ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`)) : 'No due date';
const isLate = date => date && new Date(`${date}T23:59:59`) < new Date();

function readBoards() {
  try { return JSON.parse(localStorage.getItem(storageKey)) || initialBoards; }
  catch { return initialBoards; }
}

function App() {
  const [boards, setBoards] = useState(readBoards);
  const [boardId, setBoardId] = useState(boards[0].id);
  const [selected, setSelected] = useState(null);
  const [dragged, setDragged] = useState(null);
  const [newListOpen, setNewListOpen] = useState(false);

  const board = boards.find(item => item.id === boardId) || boards[0];
  const cardsCount = useMemo(() => board.lists.reduce((total, list) => total + list.cards.length, 0), [board]);
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(boards)), [boards]);

  const updateBoard = updater => setBoards(all => all.map(item => item.id === boardId ? updater(item) : item));
  const openNewCard = listId => setSelected({ id: uid(), title: '', description: '', tags: [], member: '', due: '', listId });
  const saveCard = card => {
    updateBoard(current => ({ ...current, lists: current.lists.map(list => {
      const withoutCard = list.cards.filter(item => item.id !== card.id);
      return list.id === card.listId ? { ...list, cards: [...withoutCard, card] } : { ...list, cards: withoutCard };
    }) }));
    setSelected(null);
  };
  const deleteCard = card => {
    updateBoard(current => ({ ...current, lists: current.lists.map(list => ({ ...list, cards: list.cards.filter(item => item.id !== card.id) })) }));
    setSelected(null);
  };
  const moveCard = (cardId, fromList, targetList) => {
    if (fromList === targetList) return;
    updateBoard(current => {
      const card = current.lists.find(list => list.id === fromList)?.cards.find(item => item.id === cardId);
      if (!card) return current;
      return { ...current, lists: current.lists.map(list => {
        if (list.id === fromList) return { ...list, cards: list.cards.filter(item => item.id !== cardId) };
        if (list.id === targetList) return { ...list, cards: [...list.cards, card] };
        return list;
      }) };
    });
  };
  const addList = name => {
    const trimmed = name.trim();
    if (!trimmed) return;
    updateBoard(current => ({ ...current, lists: [...current.lists, { id: uid(), name: trimmed, cards: [] }] }));
    setNewListOpen(false);
  };

  return <main>
    <header>
      <div className="brand">
        <p className="eyebrow">FORGE 2 / PRODUCT BOARD</p>
        <div className="title-row"><h1>{board.name}</h1><span className="card-total">{cardsCount} cards</span></div>
        <p className="sub">{board.description}</p>
      </div>
      <div className="header-actions">
        <label className="board-picker"><span className="sr-only">Select board</span><select value={boardId} onChange={event => setBoardId(event.target.value)}>{boards.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
        <button onClick={() => openNewCard(board.lists[0].id)}>+ New card</button>
      </div>
    </header>
    <p className="hint">Drag cards between columns to update their status. Changes are saved in this browser.</p>
    <section className="board" aria-label={`${board.name} lists`}>
      {board.lists.map(list => <article className="list" key={list.id} onDragOver={event => event.preventDefault()} onDrop={() => { if (dragged) moveCard(dragged.id, dragged.listId, list.id); setDragged(null); }}>
        <div className="list-head"><h2>{list.name}</h2><span>{list.cards.length}</span></div>
        <div className="cards">{list.cards.map(card => <Card key={card.id} card={card} onEdit={() => setSelected({ ...card, listId: list.id })} onDragStart={() => setDragged({ id: card.id, listId: list.id })} onDragEnd={() => setDragged(null)} />)}</div>
        <button className="ghost" onClick={() => openNewCard(list.id)}>+ Add card</button>
      </article>)}
      <section className="add-list">{newListOpen ? <ListForm onCancel={() => setNewListOpen(false)} onAdd={addList} /> : <button className="add-list-button" onClick={() => setNewListOpen(true)}>+ Add list</button>}</section>
    </section>
    {selected && <CardModal card={selected} lists={board.lists} close={() => setSelected(null)} save={saveCard} remove={deleteCard} />}
  </main>;
}

function Card({ card, onEdit, onDragStart, onDragEnd }) {
  return <button className="card" draggable onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onEdit}>
    <div className="tag-row">{card.tags.map(tag => <span className="tag" style={{ background: labels[tag].color }} key={tag}>{labels[tag].name}</span>)}</div>
    <strong>{card.title}</strong>
    {card.description && <p>{card.description}</p>}
    <footer><span className="assignee"><b>{card.member ? card.member.slice(0, 1) : '?'}</b>{card.member || 'Unassigned'}</span><time className={isLate(card.due) ? 'late' : ''}>{isLate(card.due) && 'Overdue · '}{dateLabel(card.due)}</time></footer>
  </button>;
}

function ListForm({ onCancel, onAdd }) {
  const [name, setName] = useState('');
  return <form className="list-form" onSubmit={event => { event.preventDefault(); onAdd(name); }}><input autoFocus value={name} onChange={event => setName(event.target.value)} placeholder="List name" /><div><button type="submit">Add</button><button type="button" className="text-button" onClick={onCancel}>Cancel</button></div></form>;
}

function CardModal({ card, lists, close, save, remove }) {
  const [draft, setDraft] = useState(card);
  const set = (key, value) => setDraft(current => ({ ...current, [key]: value }));
  const toggleLabel = tag => set('tags', draft.tags.includes(tag) ? draft.tags.filter(item => item !== tag) : [...draft.tags, tag]);
  return <div className="overlay" role="presentation" onMouseDown={event => event.target === event.currentTarget && close()}>
    <form className="modal" onSubmit={event => { event.preventDefault(); save(draft); }}>
      <button type="button" className="close" aria-label="Close editor" onClick={close}>×</button>
      <p className="eyebrow">CARD DETAILS</p>
      <input className="title-input" required value={draft.title} onChange={event => set('title', event.target.value)} placeholder="Card title" />
      <label>Description<textarea value={draft.description} onChange={event => set('description', event.target.value)} placeholder="Add more context…" /></label>
      <div className="grid"><label>Assignee<select value={draft.member} onChange={event => set('member', event.target.value)}><option value="">Unassigned</option><option>Aarav</option><option>Maya</option><option>Riya</option></select></label><label>Due date<input type="date" value={draft.due} onChange={event => set('due', event.target.value)} /></label></div>
      <label>Status<select value={draft.listId} onChange={event => set('listId', event.target.value)}>{lists.map(list => <option value={list.id} key={list.id}>{list.name}</option>)}</select></label>
      <fieldset><legend>Labels</legend>{Object.entries(labels).map(([id, label]) => <label className="check" key={id}><input type="checkbox" checked={draft.tags.includes(id)} onChange={() => toggleLabel(id)} /><span style={{ background: label.color }} />{label.name}</label>)}</fieldset>
      <div className="actions"><button type="button" className="delete" onClick={() => remove(draft)}>Delete card</button><button>Save card</button></div>
    </form>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
