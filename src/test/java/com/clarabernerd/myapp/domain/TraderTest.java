package com.clarabernerd.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.clarabernerd.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TraderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Trader.class);
        Trader trader1 = new Trader();
        trader1.setId(1L);
        Trader trader2 = new Trader();
        trader2.setId(trader1.getId());
        assertThat(trader1).isEqualTo(trader2);
        trader2.setId(2L);
        assertThat(trader1).isNotEqualTo(trader2);
        trader1.setId(null);
        assertThat(trader1).isNotEqualTo(trader2);
    }
}
