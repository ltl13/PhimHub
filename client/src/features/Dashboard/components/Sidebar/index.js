import React from 'react';
import NavSection from './NavSection';
import sidebarConfig from './SidebarConfig';

function Sidebar(props) {
  return <NavSection navConfig={sidebarConfig} />;
}

export default Sidebar;
