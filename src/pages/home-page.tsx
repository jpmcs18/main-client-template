import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
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
  faUser,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo, useState } from 'react';
import { ModuleRoutes } from '../routes';
import Icon from './components/icon';
import ManageProfile from './modals/manage-profile';
import PersonnelPage from './personnel-page';
import RolePage from './role-page';
import MenuItem from '../entities/MenuItem';
import { getSessionMenus } from '../processors/session-manager';

export default function HomePage() {
  const [showProfile, setShowProfile] = useState(false);
  const authorize = useAuthorize();
  const profile = useUserProfile();
  const updateAuthorize = useUpdateAuthorize();
  const setMessage = useSetMessage();
  const [showMenu, setShowMenu] = useState(false);
  const menus: MenuItem[] = useMemo(
    () => [
      {
        isHead: true,
        name: 'Managements',
        menus: [
          {
            route: ModuleRoutes.Personnel,
            name: 'Personnel',
          },
          {
            route: ModuleRoutes.User,
            name: 'Users',
          },
          {
            route: ModuleRoutes.Role,
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
                      <FontAwesomeIcon size='lg' icon={faBars as IconProp} />
                    </button>
                    <div className={'menus ' + (showMenu ? 'menu-show' : '')}>
                      <div className='menu-item-container'>
                        <div className='menu-item-header'>
                          <NavLink
                            onClick={() => setShowMenu(() => false)}
                            to={ModuleRoutes.Home}
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
                              {profile?.personnel?.fullName}
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
                          {menus.map((menu) => (
                            <div className='menu-items' key={menu.name}>
                              {menu.isHead ? (
                                <>
                                  <div className='head'>{menu.name}</div>
                                  <div className='navs'>
                                    {menu.menus?.map((nav) => (
                                      <div
                                        key={nav.route}
                                        className='menu-item'>
                                        <NavLink
                                          onClick={() =>
                                            setShowMenu(() => false)
                                          }
                                          to={nav.route ?? ''}
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
                                </>
                              ) : (
                                <div className='menu-item main-menus'>
                                  <NavLink
                                    onClick={() => setShowMenu(() => false)}
                                    to={menu.route ?? ''}
                                    className='nav-menu'>
                                    {menu.name}
                                    <FontAwesomeIcon
                                      className='menu-icon'
                                      icon={faAngleRight as IconProp}
                                    />
                                  </NavLink>
                                </div>
                              )}
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
                <NavLink to={ModuleRoutes.Home} className='nav-icon'>
                  <Icon />
                </NavLink>
              </div>
              <div className='menu-container desktop-profile'>
                <button className='nav-icon user'>
                  <FontAwesomeIcon icon={faUserCircle} size='lg' />
                </button>
                <div className='floating-user-info'>
                  <div className='infomation'>
                    <div className='user-icon'>
                      <FontAwesomeIcon
                        icon={faUserCircle}
                        size='2xl'
                        className='nav-icon user'
                      />
                    </div>
                    <div className='user-details'>
                      <span className='name'>
                        {profile?.personnel?.fullName}
                      </span>
                      <span className='name-subtitle'>{profile?.username}</span>
                    </div>
                  </div>
                  <div className='controls'>
                    <button
                      onClick={() => setShowProfile(true)}
                      className='btn-user-control'>
                      Update Profile
                    </button>
                    <button onClick={logoutUser} className='btn-user-control'>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          </header>
          <Routes>
            {(profile?.distinctModules?.filter(
              (x) => x.route === ModuleRoutes.User
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={ModuleRoutes.User} element={<UserPage />} />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === ModuleRoutes.Role
            )?.[0]?.id ||
              profile?.admin) && (
              <Route path={ModuleRoutes.Role} element={<RolePage />} />
            )}
            {(profile?.distinctModules?.filter(
              (x) => x.route === ModuleRoutes.Personnel
            )?.[0]?.id ||
              profile?.admin) && (
              <Route
                path={ModuleRoutes.Personnel}
                element={<PersonnelPage />}
              />
            )}
          </Routes>
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
