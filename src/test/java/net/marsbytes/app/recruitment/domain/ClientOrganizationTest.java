package net.marsbytes.app.recruitment.domain;

import static org.assertj.core.api.Assertions.assertThat;

import net.marsbytes.app.recruitment.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ClientOrganizationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ClientOrganization.class);
        ClientOrganization clientOrganization1 = new ClientOrganization();
        clientOrganization1.setId(1L);
        ClientOrganization clientOrganization2 = new ClientOrganization();
        clientOrganization2.setId(clientOrganization1.getId());
        assertThat(clientOrganization1).isEqualTo(clientOrganization2);
        clientOrganization2.setId(2L);
        assertThat(clientOrganization1).isNotEqualTo(clientOrganization2);
        clientOrganization1.setId(null);
        assertThat(clientOrganization1).isNotEqualTo(clientOrganization2);
    }
}
