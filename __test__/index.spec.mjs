import test from 'ava';
import { randomFillSync, randomFillSyncNew } from '../index.js';
import crypto from 'node:crypto';

// Helper function to check if the buffer is filled with non-zero values
function isBufferFilled(buffer) {
    return buffer.some(byte => byte !== 0);
}

test('randomFillSync fills buffer with random values', t => {
    const buffer = Buffer.alloc(16); // Initialize a zeroed-out buffer
    randomFillSync(buffer);

    t.true(isBufferFilled(buffer), 'Buffer should be filled with random values');
    t.is(buffer.length, 16, 'Buffer length should remain unchanged');
});

test('randomFillSyncNew fills buffer with random values', t => {
    const buffer = Buffer.alloc(16); // Initialize a zeroed-out buffer
    randomFillSyncNew(buffer);

    t.true(isBufferFilled(buffer), 'Buffer should be filled with random values');
    t.is(buffer.length, 16, 'Buffer length should remain unchanged');
});

test('randomFillSync and randomFillSyncNew produce different outputs', t => {
    const buffer1 = Buffer.alloc(16);
    const buffer2 = Buffer.alloc(16);

    randomFillSync(buffer1);
    randomFillSyncNew(buffer2);

    t.notDeepEqual(buffer1, buffer2, 'Buffers filled by different methods should not be identical');
});

test('randomFillSync performance comparison with crypto.randomFillSync', t => {
    const buffer = Buffer.alloc(16);
    const t1 = performance.now();
    randomFillSync(buffer);
    const t2 = performance.now();

    const bufferCrypto = Buffer.alloc(16);
    const t3 = performance.now();
    crypto.randomFillSync(bufferCrypto);
    const t4 = performance.now();

    t.pass(`randomFillSync: ${t2 - t1}ms, crypto.randomFillSync: ${t4 - t3}ms`);
});

test('randomFillSyncNew performance comparison with crypto.randomFillSync', t => {
    const buffer = Buffer.alloc(16);
    const t1 = performance.now();
    randomFillSyncNew(buffer);
    const t2 = performance.now();

    const bufferCrypto = Buffer.alloc(16);
    const t3 = performance.now();
    crypto.randomFillSync(bufferCrypto);
    const t4 = performance.now();

    t.pass(`randomFillSyncNew: ${t2 - t1}ms, crypto.randomFillSync: ${t4 - t3}ms`);
});
