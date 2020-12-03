package ru.neexol.debtable.utils

import de.nielsfalk.ktor.swagger.HttpCodeResponse
import io.ktor.http.*

fun unauthorized(): HttpCodeResponse = HttpCodeResponse(HttpStatusCode.Unauthorized, listOf(), "Wrong token.")