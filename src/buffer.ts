import { dragDrop } from './index.js'
import parallel from 'run-parallel'
import blobToBuffer from 'blob-to-buffer'

export function dragDropAsBuffer (elem:Element, cb) {
    return dragDrop(elem, function (files, pos, fileList) {
        const tasks = files.map(function (file) {
            return function (cb) {
                blobToBuffer(file, function (err, buffer) {
                    if (err) return cb(err)
                    buffer.name = file.name
                    buffer.fullPath = file.fullPath
                    buffer.size = file.size
                    buffer.type = file.type
                    buffer.lastModifiedDate = file.lastModifiedDate
                    cb(null, buffer)
                })
            }
        })

        parallel(tasks, function (err, results) {
            if (err) throw err
            cb(results, pos, fileList)
        })
    })
}
