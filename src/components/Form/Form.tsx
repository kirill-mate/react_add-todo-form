import { useState } from 'react';

import './Form.scss';
import usersFromServer from '../../api/users';
import { Todo } from '../../types/Todo';
import { getUserById } from '../../services/getUserById';

type Props = {
  addTodo: (todo: Todo) => void;
  todos: Todo[];
};

function getTheLargestId(todos: Todo[]) {
  if (todos.length === 0) {
    return;
  }

  return Math.max(...todos.map(todo => todo.id)) + 1;
}

export const Form: React.FC<Props> = ({ addTodo, todos }) => {
  const [title, setTitle] = useState('');
  const [secectedUser, setSecectedUser] = useState('0');
  const [titleError, setTitleError] = useState(false);
  const [selectedUserError, setSelectedUserError] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedTitle = title
      .replace(/[^a-zA-Zа-яА-ЯёЁіїІЇєЄґҐ0-9 ]/g, '')
      .trim();

    if (!cleanedTitle) {
      setTitleError(true);
    }

    if (secectedUser === '0') {
      setSelectedUserError(true);
    }

    if (!cleanedTitle || secectedUser === '0') {
      return;
    }

    const user = getUserById(+secectedUser);

    if (!user) {
      return;
    }

    const userId = user.id;
    const completed = false;
    const id = getTheLargestId(todos);

    if (!id) {
      return;
    }

    addTodo({
      id,
      title: cleanedTitle,
      completed,
      userId,
    });

    setTitle('');
    setSecectedUser('0');
    setTitleError(false);
    setSelectedUserError(false);
  }

  function changeSelectedUser(event: React.ChangeEvent<HTMLSelectElement>) {
    setSecectedUser(event.target.value);
    setSelectedUserError(false);
  }

  function changeTitle(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
    setTitleError(false);
  }

  return (
    <form action="/api/todos" method="POST" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="title">Title:</label>

        <input
          id="title"
          value={title}
          type="text"
          data-cy="titleInput"
          onChange={changeTitle}
          placeholder="Enter a title"
        />

        {titleError && <span className="error">Please enter a title</span>}
      </div>

      <div className="field">
        <label htmlFor="users">Users:</label>

        <select
          id="users"
          value={secectedUser}
          data-cy="userSelect"
          onChange={changeSelectedUser}
        >
          <option value="0" disabled>
            Choose a user
          </option>
          {usersFromServer.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {selectedUserError && (
          <span className="error">Please choose a user</span>
        )}
      </div>

      <button type="submit" data-cy="submitButton">
        Add
      </button>
    </form>
  );
};
