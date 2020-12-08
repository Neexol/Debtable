package ru.neexol.debtable.utils

fun <T> Boolean.ifTrue(block: () -> T) = if (this) block() else null

fun <T> Boolean.ifFalse(block: () -> T) = (!this).ifTrue(block)