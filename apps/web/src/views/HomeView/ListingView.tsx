"use client";
import ListingDetail from '@/components/Listing/ListingDetail';
import ClientCompopnent from '@/layouts/ClientComponent';
import Empty from '@/utils/EmptyHandler';
import React from 'react'

const ListingView = () => {
  // const Listing = "contoh";

  // if (!Listing) {
  //   return (
  //     <ClientCompopnent>
  //       <Empty />
  //     </ClientCompopnent>
  //   )
  // }

  return (
    <ClientCompopnent>
      <ListingDetail />
    </ClientCompopnent>
  )
}

export default ListingView