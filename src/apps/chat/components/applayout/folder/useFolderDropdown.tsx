import * as React from 'react';

import FolderIcon from '@mui/icons-material/Folder';

import type { DConversationId } from '~/common/state/store-chats';
import { DropdownItems, GoodDropdown } from '~/common/components/GoodDropdown';
import { useFolderStore } from '~/common/state/store-folders';


const SPECIAL_ID_REMOVE = '_REMOVE_';


export function useFolderDropdown(conversationId: DConversationId | null) {

  // external state
  const { folders } = useFolderStore();

  // derived state

  // current folder ID for the selected conversation
  const currentFolderId = folders.find(folder => folder.conversationIds.includes(conversationId || ''))?.id || null;


  // Prepare items for the dropdown
  const folderItems: DropdownItems = React.useMemo(() => {
    // add one item per folder
    const items = folders.reduce((items, folder) => {
      items[folder.id] = {
        title: folder.title,
        icon: <FolderIcon sx={{ color: folder.color }} />,
      };
      return items;
    }, {} as DropdownItems);

    // add one item representing no folder
    items[SPECIAL_ID_REMOVE] = {
      title: 'No Folder',
    };

    return items;
  }, [folders]);

  // Handle folder change
  const handleFolderChange = (_event: any, folderId: string | null) => {
    if (conversationId && folderId) {
      // Remove conversation from all folders
      folders.forEach(folder => {
        if (folder.conversationIds.includes(conversationId)) {
          useFolderStore.getState().removeConversationFromFolder(folder.id, conversationId);
        }
      });
      // Add conversation to the selected folder
      useFolderStore.getState().addConversationToFolder(folderId, conversationId);
    }
  };


  // Create the dropdown component
  const folderDropdown = (
    <GoodDropdown
      items={folderItems}
      value={currentFolderId}
      onChange={handleFolderChange}
      placeholder='Select a folder'
      showSymbols={true}
    />
  );

  return { folderDropdown };
}