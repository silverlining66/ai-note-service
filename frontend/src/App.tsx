/**
 * Main App component
 * Following Constitution Principles: Dynamic-first, Visual Excellence, Responsive Excellence
 */

import React from 'react'
import { DialogueProvider, useDialogue } from './hooks/useDialogue.tsx'
import { PanelLayoutProvider, usePanelLayout } from './hooks/usePanelLayout.tsx'
import { useKnowledgePoints } from './hooks/useKnowledgePoints'
import { ImageUpload } from './components/ImageUpload/ImageUpload'
import { KnowledgePanel } from './components/KnowledgePanel/KnowledgePanel'
import { DialoguePanel } from './components/DialoguePanel/DialoguePanel'
import { PanelLayout } from './components/PanelLayout/PanelLayout'
import { clearOldMockDataDialogues } from './utils/clearOldCache'
import { storage } from './utils/storage'

function AppContent() {
  const {
    image,
    knowledgeData,
    loading,
    error,
    uploadImage,
    selectKnowledgePoint,
    selectedKnowledgePoint,
  } = useKnowledgePoints()

  const { layout, showPanel, hidePanel } = usePanelLayout()
  const { switchKnowledgePoint } = useDialogue()

  // Hide panels when data is not available (fixes bug when opening in new window)
  React.useEffect(() => {
    const knowledgePanel = layout.panels.find((p) => p.type === 'knowledge')
    const dialoguePanel = layout.panels.find((p) => p.type === 'dialogue')
    
    if (knowledgePanel?.visible && !knowledgeData) {
      hidePanel('knowledge')
    }
    if (dialoguePanel?.visible && !selectedKnowledgePoint) {
      hidePanel('dialogue')
    }
  }, [layout, knowledgeData, selectedKnowledgePoint, hidePanel])

  // Show knowledge panel when data is available
  React.useEffect(() => {
    if (knowledgeData && !layout.panels.find((p) => p.type === 'knowledge')?.visible) {
      showPanel('knowledge')
    }
  }, [knowledgeData, layout, showPanel])

  // Switch dialogue when knowledge point is selected
  React.useEffect(() => {
    if (selectedKnowledgePoint) {
      switchKnowledgePoint(selectedKnowledgePoint)
      showPanel('dialogue')
    }
  }, [selectedKnowledgePoint, switchKnowledgePoint, showPanel])

  return (
    <PanelLayout
      layout={layout}
      mainPanel={
        <div className="h-full flex flex-col items-center justify-center p-8">
          <ImageUpload
            onUpload={uploadImage}
            image={image}
            loading={loading}
            error={error}
          />
        </div>
      }
      knowledgePanel={
        knowledgeData ? (
          <KnowledgePanel
            data={knowledgeData}
            onKnowledgePointClick={selectKnowledgePoint}
            selectedPoint={selectedKnowledgePoint}
          />
        ) : null
      }
      dialoguePanel={
        selectedKnowledgePoint ? (
          <DialoguePanel knowledgePoint={selectedKnowledgePoint} />
        ) : null
      }
    />
  )
}

function App() {
  // Clear all dialogues and old mock data on app startup
  React.useEffect(() => {
    // Clear all dialogue histories on every app restart
    storage.clearAllDialogues()
    // Also clear old mock data for compatibility
    clearOldMockDataDialogues()
    console.log('[App] All dialogues cleared on startup')
  }, [])

  return (
    <DialogueProvider>
      <PanelLayoutProvider>
        <div className="h-screen w-screen overflow-hidden bg-dark-bg">
          <AppContent />
        </div>
      </PanelLayoutProvider>
    </DialogueProvider>
  )
}

export default App

