#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

use napi::bindgen_prelude::*;
use napi_derive::napi;
use rand::RngCore;

/// Mimics the behavior of `crypto.randomFillSync` from Node.js.
#[napi]
pub fn random_fill_sync(mut buffer: Buffer, offset: Option<u32>, length: Option<u32>) -> Result<()> {
    let buffer_len = buffer.len();
    let offset = offset.unwrap_or(0) as usize;
    let length = length.unwrap_or((buffer_len - offset) as u32) as usize;

    if offset > buffer_len || offset + length > buffer_len {
        return Err(Error::new(
            Status::InvalidArg,
            "Offset and length are out of bounds".to_string(),
        ));
    }

    // Fill the buffer slice with random bytes
    let mut rng = rand::thread_rng();
    rng.fill_bytes(&mut buffer[offset..offset + length]);

    Ok(())
}

#[napi]
pub fn random_fill_sync_new(mut buffer: Buffer, offset: Option<u32>, length: Option<u32>) -> Result<()> {
    let offset = offset.unwrap_or(0) as usize;
    let length = length.unwrap_or(buffer.len().saturating_sub(offset) as u32) as usize;

    let end = offset + length;
    if end > buffer.len() {
        return Err(Error::new(
            Status::InvalidArg,
            "Offset and length are out of bounds".to_string(),
        ));
    }

    let slice = &mut buffer[offset..end];
    let mut rng = rand::thread_rng();
    rng.fill_bytes(slice);

    Ok(())
}