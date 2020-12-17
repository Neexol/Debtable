package ru.neexol.debtable.utils

inline fun <T, R, C> T.foldRunCatching(
    block: T.() -> R,
    onSuccess: (value: R) -> C,
    onFailure: (exception: Throwable) -> C
) = runCatching { block() }.fold(onSuccess, onFailure)