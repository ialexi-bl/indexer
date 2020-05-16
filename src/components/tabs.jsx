import React from 'react'
import classNames from 'classnames'
import 'styles/tabs.scss'

const TabsContext = React.createContext({})

export function Tabs({ className, defaultTab, children }) {
  const [currentTab, setCurrentTab] = React.useState(defaultTab)
      , context = React.useMemo(() => ({
        currentTab,
        changeTab: setCurrentTab,
      }), [currentTab])
  
  return (
    <div className={classNames('Tabs', className)}>
      <TabsContext.Provider value={context}>
        {children}
      </TabsContext.Provider>
    </div>
  )
}

export function TabList({ children }) {
  return (
      <div className={'Tabs__TabList'}>{children}</div>
  )
}

export function Tab({ id, label }) {
  const { currentTab, changeTab } = React.useContext(TabsContext)
      , onClick = React.useCallback(() => {
        changeTab(id)
      }, [changeTab, id])
  
  return (
      <span
          className={classNames('Tabs__Tab', { Tabs__Tab_active: id === currentTab })}
          onClick={onClick}
      >{label}</span>
  )
}

export function TabPanel({ id, children }) {
  const { currentTab } = React.useContext(TabsContext)
  
  return (
      <div className={classNames('Tabs__TabPanel', { Tabs__TabPanel_active: id === currentTab })}>
        {children}
      </div>
  )
}
