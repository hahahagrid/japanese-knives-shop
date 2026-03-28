'use client'

import React, { useState, useCallback } from 'react'
import { useForm, useField } from '@payloadcms/ui'

export default function BulkUploadDropzone() {
  const { setModified } = useForm()
  const { value, setValue } = useField<any>({ path: 'images' })
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState('')

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      await uploadFiles(Array.from(e.target.files))
      // Reset input so the same files can be selected again
      e.target.value = ''
    }
  }

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files)
      if (files.length === 0) return
      await uploadFiles(files)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value]
  )

  const uploadFiles = async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'))
    if (imageFiles.length === 0) return

    setUploading(true)
    const newIds: string[] = []

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      setProgress(`Загружается ${i + 1} / ${imageFiles.length}: ${file.name}`)

      try {
        const formData = new FormData()
        formData.append('file', file)
        // Payload REST API expects extra fields as JSON in _payload key
        formData.append('_payload', JSON.stringify({ alt: file.name }))

        const res = await fetch('/api/media', {
          method: 'POST',
          body: formData,
          credentials: 'same-origin',
        })

        if (res.ok) {
          const data = await res.json()
          if (data.doc?.id) {
            newIds.push(data.doc.id)
          }
        } else {
          const errData = await res.json().catch(() => null)
          const errMsg = errData?.errors?.[0]?.message || res.statusText
          console.error('Upload failed:', file.name, errMsg)
          setProgress(`Ошибка: ${file.name} — ${errMsg}`)
          await new Promise(r => setTimeout(r, 2000))
        }
      } catch (err) {
        console.error('Upload error:', err)
      }
    }

    if (newIds.length > 0) {
      const currentVals = Array.isArray(value)
        ? value.map((v: any) => (typeof v === 'object' && v !== null ? v.id : v)).filter(Boolean)
        : []
      setValue([...currentVals, ...newIds])
      setModified(true)
      setProgress(`✓ Загружено ${newIds.length} фото`)
    }

    setUploading(false)
    setTimeout(() => setProgress(''), 3000)
  }

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? 'var(--theme-success-500, #22c55e)' : 'var(--theme-elevation-300)'}`,
          borderRadius: '6px',
          padding: '1.5rem',
          textAlign: 'center',
          backgroundColor: isDragging ? 'var(--theme-elevation-50)' : 'var(--theme-elevation-0)',
          cursor: uploading ? 'default' : 'pointer',
          position: 'relative',
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
          pointerEvents: uploading ? 'none' : 'auto',
        }}
      >
        <p style={{ margin: 0, fontWeight: 500, color: 'var(--theme-text)', fontSize: '0.85rem' }}>
          {progress
            ? progress
            : uploading
            ? 'Загрузка...'
            : '📎 Перетащите несколько фото сюда или нажмите для выбора'}
        </p>
        {!uploading && (
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              opacity: 0,
              cursor: 'pointer',
              width: '100%',
              height: '100%',
            }}
          />
        )}
      </div>
    </div>
  )
}
