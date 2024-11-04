import { test } from '@bicycle-codes/tapzero'
import { dragDrop } from '../src/index.js'

// writing tests for this would be hard, see the example for interactive testing

test('Basics', t => {
    dragDrop('#drop-target', () => null)
    t.ok("Doesn't throw")
})
