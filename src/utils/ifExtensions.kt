package ru.neexol.debtable.utils

fun Boolean.ifTrue(block: () -> Unit) {
    if (this) block()
}

fun Boolean.ifFalse(block: () -> Unit) = (!this).ifTrue(block)