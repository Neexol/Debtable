package ru.neexol.debtable.models.responses

import com.google.gson.annotations.SerializedName

data class UserBalanceResponse(
    @SerializedName("user") val user: UserResponse,
    @SerializedName("balance") val balance: Float
) {
    companion object {
        val EXAMPLES = listOf(
            mapOf(
                "user" to UserResponse.EXAMPLES[0],
                "balance" to 55.6
            ),
            mapOf(
                "user" to UserResponse.EXAMPLES[1],
                "balance" to -120.6
            ),
            mapOf(
                "user" to UserResponse.EXAMPLES[2],
                "balance" to 65
            )
        )
    }
}