import * as React from 'react';
import * as Loadable from 'react-loadable';
import { RouteProps } from 'react-router-dom';

const MyLoadingComponent = ({ isLoading, error }:any) => {
  if (isLoading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Sorry, there was a problem loading the page.</div>;
  } else {
    return null;
  }
};

const _loadable = (loadFunc:any) => {
  return Loadable({
    loader: loadFunc,
    loading: MyLoadingComponent,
    delay: 200,
  });
};

// console.log('page-not-found is', _loadable(() => import('../components/page-not-found')));

/**
 * 全局路由表
 */
export let routes:RouteProps[] = [
  {
    path: '/',
    exact: true,
    component: _loadable(() => import('./index')),
  },
  {
    component: _loadable(() => import('../components/page-not-found')),
  },
];