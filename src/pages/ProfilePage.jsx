import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { UserAvatar } from '../components/UserAvatar.jsx';

export function ProfilePage({ house, showToast, onLogout }) {
  const { data, actions } = house;
  const [user, setUser] = useState(data.user);

  function updateField(field, value) {
    setUser(current => ({ ...current, [field]: value, avatar: field === 'name' ? value[0]?.toUpperCase() || 'U' : current.avatar }));
  }

  return (
    <div className="profile-stack">
      <section className="card form-card">
        <h2>Perfil</h2>
        <div className="profile-preview">
          <UserAvatar person={user} size={52} />
          <div>
            <strong>{user.name}</strong>
            <p className="muted">Cor usada quando você paga uma conta.</p>
          </div>
        </div>
        <label>
          Nome
          <input value={user.name} onChange={event => updateField('name', event.target.value)} />
        </label>
        <label>
          E-mail
          <input type="email" value={user.email} onChange={event => updateField('email', event.target.value)} />
        </label>
        <label>
          Cor
          <input type="color" value={user.color} onChange={event => updateField('color', event.target.value)} />
        </label>
        <button className="primary-button" type="button" onClick={() => { actions.updateUser(user); showToast('Perfil atualizado.'); }}>Salvar perfil</button>
      </section>

      <section className="card residents-card">
        <h2>Moradores</h2>
        {data.people.map(person => (
          <div className="resident-row" key={person.id || person.name}>
            <UserAvatar person={person} />
            <span>{person.name}</span>
            <input type="color" value={person.color} aria-label={`Cor de ${person.name}`} onChange={event => actions.updatePerson({ ...person, color: event.target.value })} />
          </div>
        ))}
      </section>

      <button className="ghost-button logout-profile" type="button" onClick={onLogout}><LogOut size={17} /> Sair da casa</button>
    </div>
  );
}
