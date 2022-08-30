import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom';
import {
  useAuthorize,
  useSetMessage,
  useUpdateAuthorize,
  useUserProfile,
} from '../custom-hooks/authorize-provider';
import LoginPage from './login-page';
import UserPage from './user-page';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleRight,
  faBars,
  faHome,
  faPowerOff,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo, useState } from 'react';
import { Routes } from '../routes';
import Icon from './components/icon';
import ManageProfile from './modals/manage-profile';
import PersonnelPage from './personnel-page';
import RolePage from './role-page';

export default function HomePage() {
  const [showProfile, setShowProfile] = useState(false);
  const authorize = useAuthorize();
  const profile = useUserProfile();
  const updateAuthorize = useUpdateAuthorize();
  const setMessage = useSetMessage();
  const [showMenu, setShowMenu] = useState(false);
  const menus: {
    head: string;
    navs: { route: string | undefined; name: string | undefined }[];
  }[] = useMemo(
    () => [
      {
        head: 'Managements',
        navs: [
          {
            route: Routes.Personnel,
            name: 'Personnel',
          },
          {
            route: Routes.User,
            name: 'Users',
          },
          {
            route: Routes.Role,
            name: 'Roles',
          },
        ],
      },
    ],
    [profile?.distinctModules, profile?.admin]
  );
  function logoutUser() {
    setMessage({
      message: 'Continue to logout?',
      action: 'YESNO',
      onOk: () => {
        updateAuthorize(false);
        setShowProfile(false);
      },
    });
  }

  return (
    <>
      {authorize ? (
        <BrowserRouter>
          <header>
            <nav>
              <div className='menu-container'>
                {!!menus?.length && (
                  <div className='nav-menu-container'>
                    <button
                      className='nav-icon'
                      onClick={() => setShowMenu(() => true)}>
                      <FontAwesomeIcon icon={faBars as IconProp} />
                    </button>
                    <div className={'menus ' + (showMenu ? 'menu-show' : '')}>
                      <div className='menu-item-container'>
                        <div className='menu-item-header'>
                          <NavLink
                            onClick={() => setShowMenu(() => false)}
                            to={Routes.Home}
                            exact
                            className='nav-icon home-icon'>
                            <FontAwesomeIcon icon={faHome as IconProp} />
                          </NavLink>
                          <button
                            className='nav-icon close-nav-menu'
                            onClick={() => setShowMenu(() => false)}>
                            <FontAwesomeIcon icon={faTimes as IconProp} />
                          </button>
                        </div>

                        <div className='menu-container mobile-profile'>
                          <div className='name'>
                            <label
                              className='nav-menu'
                              onClick={() => {
                                setShowProfile(true);
                                setShowMenu(() => false);
                              }}>
                              {profile?.name}
                              <FontAwesomeIcon
                                className='name-icon'
                                icon={faAngleRight as IconProp}
                              />
                            </label>
                            <span className='name-subtitle'>
                              {profile?.username}
                            </span>
                          </div>
                          <button
                            onClick={logoutUser}
                            className='nav-menu logout'>
                            Logout
                          </button>
                        </div>
                        <div className='menus-container'>
                          {menus
                            .filter((x) => x.navs.length > 0)
                            .map((menu) => (
                              <div className='menu-items' key={menu.head}>
                                {menu.head && (
                                  <div className='head'>{menu.head}</div>
                                )}
                                <div className='navs'>
                                  {menu.navs.map((nav) => (
                                    <div key={nav.route} className='menu-item'>
                                      <NavLink
                                        onClick={() => setShowMenu(() => false)}
                                        to={nav.route ?? ''}
                                        exact
                                        className='nav-menu'>
                                        {nav.name}
                                        <FontAwesomeIcon
                                          className='menu-icon'
                                          icon={faAngleRight as IconProp}
                                        />
                                      </NavLink>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div
                        className='menu-content-blocker'
                        onClick={() => setShowMenu(() => false)}></div>
                    </div>
                  </div>
                )}
                <NavLink to={Routes.Home} exact className='nav-icon'>
                  <Icon />
                </NavLink>
              </div>
              <div className='menu-container desktop-profile'>
                <div>
                  <label
                    className='nav-menu'
                    onClick={() => setShowProfile(true)}>
                    {profile?.name}
                  </label>
                  <span className='name-subtitle'>{profile?.username}</span>
                </div>
                <button onClick={logoutUser} className='nav-icon'>
                  <FontAwesomeIcon icon={faPowerOff as IconProp} />
                </button>
              </div>
            </nav>
          </header>
          <Switch>
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.User
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={Routes.User} exact component={UserPage} />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.Role
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={Routes.Role} exact component={RolePage} />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === Routes.Personnel
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={Routes.Personnel} exact component={PersonnelPage} />
            )}
          </Switch>
          <div>
            {showProfile && (
              <ManageProfile onClose={() => setShowProfile(false)} />
            )}
          </div>
        </BrowserRouter>
      ) : (
        <LoginPage />
      )}
    </>
  );
}
